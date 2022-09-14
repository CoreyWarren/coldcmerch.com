# Serializers for User Authentication Operations:

from django.core import exceptions
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password


# When you have a custom user model ,this is how to get access to it
# to pass it later into our models (below):
User = get_user_model()


# class that is closely tied with the model
# allows for validation around our models.py
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # puttin '__all__' here would expose everything, including the hashed password
        fields = ('first_name', 'last_name', 'email', 'password')

    # Validate validity of the password, such as if it is too common
    # or too short.
    def validate(self, data):
        user = User(**data)
        password = data.get('password')

        try:
            validate_password(password, user)
        except exceptions.ValidationError as e:
            serializer_errors = serializers.as_serializer_error(e)
            raise exceptions.ValidationError(
                {'password': serializer_errors['non_field_errors']}
            )

        # validation data needs to be returned:
        return data

            

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            email = validated_data['email'],
            password = validated_data['password'],
        )
        
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')