# Logout Functionality Middleware for Users
# [Blacklist Token Middlewar]

# The purpose of this middle ware:
# 1. Check if the token is blacklisted.
# 2. If it is, return a 401 response.
# 3. If it is not, continue with the request.

from .models import BlacklistedToken
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import status

class BlacklistMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        refresh_token = request.COOKIES.get('refresh')
        if (BlacklistedToken.objects.filter(token=refresh_token).exists()):
            response = Response(
                data={'detail': '"Refresh" Auth Token is blacklisted'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            response.accepted_renderer = JSONRenderer()
            response.accepted_media_type = "application/json"
            response.renderer_context = {}
            response.render()
            return response
        return self.get_response(request)

    # Here's how the above code actually works in production:

    # 1. The user logs in and receives an access token and a refresh token.
    # 2. The user logs out and the tokens are both blacklisted.
    # 3. The user's browser tries to use the same tokens (cookies aren't automatically deleted)
    # 4. The middleware detects that the tokens are blacklisted and returns a 401 response.
    # 5. The user is redirected to the login page to login again! Yay!

    # In essence, the middleware checks if the refresh token is blacklisted.
    #   And the token becomes blacklisted when the user logs out.

    # The reason we need this is so that a user can have
    #   the satisfaction of logging out by clicking a button.

    # If we didn't have this middleware, the user would have to
    #   manually delete the cookies in order to log out. (Hey, I've had to do that before!)
