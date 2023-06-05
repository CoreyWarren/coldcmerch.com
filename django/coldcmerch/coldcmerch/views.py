from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:  # if authentication is successful
            max_age = 60 * 60 * 24  # One day, in seconds
            # Set cookies
            response.set_cookie('access', response.data['access'], max_age=max_age, secure=True, httponly=True, samesite='Lax', path='/', domain='.coldcmerch.com')
            response.set_cookie('refresh', response.data['refresh'], max_age=max_age, secure=True, httponly=True, samesite='Lax', path='/', domain='.coldcmerch.com')
            
            # Remove the tokens from the body
            # response.data = {'detail': 'success'}

        return response
    

# This is a custom token verification view
# We added this because JWT tokens are stored in cookies
# And HTTPONLY cookies cannot be accessed by javascript
# So we need to send the token from the cookies to this django backend view.
# This view will then verify the token and return the result.

from rest_framework_simplejwt.views import TokenVerifyView

class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        # Get the token from cookies
        request.data['token'] = request.COOKIES.get('access')
        return super().post(request, *args, **kwargs)