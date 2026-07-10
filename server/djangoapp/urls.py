from django.urls import path
from . import views  # This is completely valid here because djangoapp HAS a views.py file!

app_name = 'djangoapp'

urlpatterns = [
    # Authentication endpoints for your React fetch calls
    path('register/', views.registration, name='registration'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_request, name='logout'),
    path(route='get_cars', view=views.get_cars, name='getcars'),
]