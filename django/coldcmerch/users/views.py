from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .serializers import UserCreateSerializer, UserSerializer

# Create your views here.
# Endpoints are here.
# Retrieve the user.

class RegisterView(APIView):

    def post(self, request):
        data = request.data # such as: fname, lname, email, password

        # Create our user! :D
        serializer = UserCreateSerializer(data = data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.create(serializer.validated_data)
        user = UserSerializer(user)

        print("User created in models- coldcmerch/users/views.py")
        
        return Response(user.data, status = status.HTTP_201_CREATED)



# used for login, but simply accessing this API endpoint alone
# will not grant you an authentication token.
# You must go thru the frontend to get an auth token.
class RetrieveUserView(APIView):
    # post an authorization header
    permission_classes = [permissions.IsAuthenticated]


    def get(self, request):
        user = request.user
        # serialize that user
        user = UserSerializer(user)

        # return it in a response that's a 200 OK response.
        return Response(user.data, status=status.HTTP_200_OK)

