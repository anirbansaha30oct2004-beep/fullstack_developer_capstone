from django.urls import path
from . import views  # This is completely valid here because djangoapp HAS a views.py file!

app_name = 'djangoapp'

urlpatterns = [
    # Authentication endpoints for your React fetch calls
    path('register/', views.registration, name='registration'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_request, name='logout'),
    path(route='get_cars', view=views.get_cars, name='getcars'),
    path(route='get_dealers', view=views.get_dealerships, name='get_dealers'),
    path(route='get_dealers/<str:state>', view=views.get_dealerships, name='get_dealers_by_state'),
    path(route='dealer/<int:dealer_id>', view=views.get_dealer_details, name='dealer_details'),
    path(route='reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews, name='dealer_reviews'),
    path(route='add_review', view=views.add_review, name='add_review'),
]
