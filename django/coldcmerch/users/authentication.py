# Why was this file created?

# This file was created to allow for the use of cookies to authenticate users.
# This is because HTTPONLY cookies cannot be accessed by javascript.
# So we need to send the token from the cookies to this django backend view.
# This view will then verify the token and return the result.


from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

logger = logging.getLogger(__name__)


class CookieJWTAuthentication(JWTAuthentication):
    def get_raw_token(self, request):

        raw_token = request.COOKIES.get('access')
        
        logger.debug(f"Raw token from cookies: {raw_token}")

        return raw_token
    

# Path: .users.authentication