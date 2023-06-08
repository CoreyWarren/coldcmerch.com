# Why was this file created?

# This file was created to allow for the use of cookies to authenticate users.
# This is because HTTPONLY cookies cannot be accessed by javascript.
# So we need to send the token from the cookies to this django backend view.
# This view will then verify the token and return the result.


from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import AuthenticationFailed
from jwt.exceptions import InvalidTokenError
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework import status
from rest_framework.response import Response

import logging
logger = logging.getLogger(__name__)


class CookieJWTAuthentication(JWTAuthentication):

    def get_raw_token(self, request):
        try:
            raw_token = request.COOKIES.get('access')
            # logger.error(f"Raw token from cookies: {raw_token}")
            if raw_token is None:
                raise AuthenticationFailed('No access token found in cookies')
            return raw_token
        except Exception as e:
            # logger.error(f"Error in get_raw_token: {e}")
            return Response({"message": "Failed to retrieve raw token from cookies."}, status=status.HTTP_400_BAD_REQUEST)

    

    def get_validated_token(self, raw_token):
        try:
            validated_token = super().get_validated_token(raw_token)
            # logger.error(f"\nValidated token: {validated_token}")
            return validated_token
        except InvalidToken as e:
            # logger.error(f"\nToken validation failed: {e}")
            return Response({"message": "Token validation failed."}, status=status.HTTP_401_UNAUTHORIZED)

    def get_user(self, validated_token):
        try:
            user = super().get_user(validated_token)
            # logger.error(f"\nUser from token: {user}")
            return user
        except Exception as e:
            # logger.error(f"\nFailed to get user from token: {e}")
            return Response({"message": "Failed to retrieve user from token."}, status=status.HTTP_400_BAD_REQUEST)
    
    def authenticate(self, request):
        # logger.error("CookieJWTAuthentication authenticate method start")

        raw_token = self.get_raw_token(request)
        # logger.error(f"Raw token after get_raw_token: {raw_token}")

        if raw_token is None:
            return None

        try:
            UntypedToken(raw_token)
        except (InvalidToken, InvalidTokenError) as e:
            # logger.error(f"Token validation failed: {e}")
            # raise AuthenticationFailed('Invalid token.')
            return Response({"message": "Invalid token provided."}, status=status.HTTP_401_UNAUTHORIZED)

        validated_token = self.get_validated_token(raw_token)
        # logger.error(f"Validated token after get_validated_token: {validated_token}")

        return self.get_user(validated_token), validated_token
    

# Path: .users.authentication