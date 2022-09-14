from django.urls import path
from .views import RegisterView, RetrieveUserView

# api/users/register

urlpatterns = [
    
    path('register', RegisterView.as_view()),
    path('me', RetrieveUserView.as_view()),
]