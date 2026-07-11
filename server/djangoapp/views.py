import json
import logging
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import analyze_review_sentiments, get_request, post_review

# Get an instance of a logger
logger = logging.getLogger(__name__)


# 1. Login View
@csrf_exempt
def login_user(request):
    username = ""
    password = ""

    if request.method == "POST":
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                username = data.get('userName') or data.get('username')
                password = data.get('password')
            except json.JSONDecodeError:
                return JsonResponse(
                    {"status": "Failed", "error": "Invalid JSON"},
                    status=400
                )
        else:
            username = (
                request.POST.get('userName') or request.POST.get('username')
            )
            password = request.POST.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            if request.content_type == 'application/json':
                return JsonResponse(
                    {"userName": username, "status": "Authenticated"}
                )
            return redirect('/')

    return JsonResponse(
        {"userName": username, "status": "Authentication Failed"},
        status=401
    )


# 2. Logout View
@csrf_exempt
def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


# 3. Registration View
@csrf_exempt
def registration(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests allowed"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('userName') or data.get('username')
        password = data.get('password')
        first_name = data.get('firstName') or data.get('first_name', '')
        last_name = data.get('lastName') or data.get('last_name', '')
        email = data.get('email', '')

        if not username or not password:
            return JsonResponse(
                {"error": "Username and password are required"},
                status=400
            )

    except (json.JSONDecodeError, KeyError):
        return JsonResponse(
            {"error": "Invalid registration layout data"},
            status=400
        )

    username_exist = User.objects.filter(username=username).exists()

    if not username_exist:
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email
        )
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)


# 4. Get Cars View
def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)
    if count == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })
    return JsonResponse({"CarModels": cars})


# 5. Get Dealerships View Proxy
def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


# 6. Get details for a specific dealer
def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# 7. Get reviews for a specific dealer and analyze sentiment dynamically
def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)

        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            if response and 'sentiment' in response:
                review_detail['sentiment'] = response['sentiment']
            else:
                review_detail['sentiment'] = "neutral"

        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# 8. Add Review View
@csrf_exempt
def add_review(request):
    if request.user.is_authenticated:
        try:
            data = json.loads(request.body)
            post_review(data)
            return JsonResponse({"status": 200})
        except Exception:
            return JsonResponse(
                {"status": 401, "message": "Error in posting review"}
            )
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})