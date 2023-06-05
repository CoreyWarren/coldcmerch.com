from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserCreateSerializer, UserSerializer
from shop.models import Cart
from users.authentication import CookieJWTAuthentication

import logging
logger = logging.getLogger(__name__)

# Create your views here.
# Endpoints are here.
# Retrieve the user.

class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        data = request.data # such as: fname, lname, email, password

        # Create our user! :D
        serializer = UserCreateSerializer(data = data)
        
        if not serializer.is_valid():
            print("User Create Serializer is not valid")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.create(serializer.validated_data)
        user = UserSerializer(user)

        print("User created in models- coldcmerch/users/views.py")

        # Create a cart for this user

        if not (Cart.objects.has_active_cart(user.instance)):
            cart = Cart.objects.create_cart(
                checked_out=False, # Assuming the cart is not checked out when first created
                cart_item=None, # Assuming no items in the cart when first created
                my_user=user.instance, # Pass the user instance to the cart
            )
            print("User and cart created in models- coldcmerch/users/views.py")
        else:
            print("User created, but already has an active cart")
        
        return Response(user.data, status = status.HTTP_201_CREATED)



# used for login, but simply accessing this API endpoint alone
# will not grant you an authentication token.
# You must go thru the frontend to get an auth token.
class RetrieveUserView(APIView):
    # post an authorization header
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    # The below is an override of the default check_permissions method.
    # The 'f' before the string allows for variable interpolation (i.e.: insertion)
    def check_permissions(self, request):
        logger.debug("Checking permissions...\n")
        logger.debug(f"Method: {request.method}\n")
        logger.debug(f"Path: {request.path}\n")
        logger.debug(f"Cookies: {request.COOKIES}\n")
        logger.debug(f"User: {request.user}\n")
        logger.debug(f"Authenticators: {self.get_authenticators()}\n")
        # logger.debug(f"Headers: {request.META}")
        super().check_permissions(request)

    def get(self, request):
        user = request.user
        logger.debug(f"User from request: {user}")
        # serialize that user
        user = UserSerializer(user)
        # return it in a response that's a 200 OK response.
        return Response(user.data, status=status.HTTP_200_OK)
    


