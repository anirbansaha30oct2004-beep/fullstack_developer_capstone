from django.http import JsonResponse
from django.shortcuts import redirect  # ✅ FIXED: Added redirect import!
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .populate import initiate
import logging
import json

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
                # ✅ FIXED: Use .get() with fallbacks to handle both cases
                username = data.get('userName') or data.get('username')
                password = data.get('password')
            except json.JSONDecodeError:
                return JsonResponse({"status": "Failed", "error": "Invalid JSON"}, status=400)
        else:
            username = request.POST.get('userName') or request.POST.get('username')
            password = request.POST.get('password')

        # Run the Django authentication helper
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            if request.content_type == 'application/json':
                return JsonResponse({"userName": username, "status": "Authenticated"})
            return redirect('/')
            
    return JsonResponse({"userName": username, "status": "Authentication Failed"}, status=401)


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
        # ✅ FIXED: Use safely targeted fallbacks to match React forms cleanly
        username = data.get('userName') or data.get('username')
        password = data.get('password')
        first_name = data.get('firstName') or data.get('first_name', '')
        last_name = data.get('lastName') or data.get('last_name', '')
        email = data.get('email', '')
        
        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)
            
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({"error": "Invalid registration layout data"}, status=400)

    username_exist = User.objects.filter(username=username).exists()

    if not username_exist:
        # Create user in auth_user table
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
def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)
    if (count == 0):
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({"CarModel": car_model.name, "CarMake": car_model.car_make.name})
    return JsonResponse({"CarModels": cars})    