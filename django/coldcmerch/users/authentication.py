# Why was this file created?

# This file was created to allow for the use of cookies to authenticate users.
# This is because HTTPONLY cookies cannot be accessed by javascript.
# So we need to send the token from the cookies to this django backend view.
# This view will then verify the token and return the result.


from rest_framework_simplejwt.authentication import JWTAuthentication
import logging
from rest_framework_simplejwt.exceptions import InvalidToken

logger = logging.getLogger(__name__)


class CookieJWTAuthentication(JWTAuthentication):

    def get_raw_token(self, request):

        raw_token = request.COOKIES.get('access')

        logger.debug(f"Raw token from cookies: {raw_token}")

        return raw_token
    

    def get_validated_token(self, raw_token):
        try:
            validated_token = super().get_validated_token(raw_token)
            logger.debug(f"Validated token: {validated_token}")
            return validated_token
        except InvalidToken as e:
            logger.error(f"Token validation failed: {e}")
            raise

    def get_user(self, validated_token):
        try:
            user = super().get_user(validated_token)
            logger.debug(f"User from token: {user}")
            return user
        except Exception as e:
            logger.error(f"Failed to get user from token: {e}")
            raise
    

# Path: .users.authentication