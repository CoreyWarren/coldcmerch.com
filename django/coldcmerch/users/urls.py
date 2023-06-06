from django.urls import path
from .views import RegisterView, RetrieveUserView, LogoutUserView

urlpatterns = [
    
    # api/users/register/
    path('register/', RegisterView.as_view(), name='register'),
    # api/users/me/
    path('me/', RetrieveUserView.as_view(), name='me'),
    # api/users/logout/
    path('logout/', LogoutUserView.as_view(), name='logout')
]
