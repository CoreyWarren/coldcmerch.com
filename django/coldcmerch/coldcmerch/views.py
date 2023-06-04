from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:  # if authentication is successful
            max_age = 60 * 60 * 24  # One day, in seconds
            # Set cookies
            response.set_cookie('access', response.data['access'], max_age=max_age, secure=True, httponly=True, samesite='Lax')
            response.set_cookie('refresh', response.data['refresh'], max_age=max_age, secure=True, httponly=True, samesite='Lax')
            
            # Remove the tokens from the body
            # response.data = {'detail': 'success'}

        return response