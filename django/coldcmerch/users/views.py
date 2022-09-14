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
        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        password = data['password']

        # Create our user! :D
        serializer = UserCreateSerializer(data = data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.create(serializer.validated_data)
        user = UserCreateSerializer(user)
        
        return Response(user.data, status = status.HTTP_201_CREATED)




class RetrieveUserView(APIView):
    # post an authorization header
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # serialize that user
        user = UserSerializer(user)

        # return it in a response that's a 200 OK response.
        return Response(user.data, status=status.HTTP_200_OK)

