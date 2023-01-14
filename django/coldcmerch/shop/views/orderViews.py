from django.shortcuts import render
from shop.models import Product
from shop.serializers import OrderCreateSerializer, \
                OrderSerializer
from shop.models import Cart, CartItem, ProductSize
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json


# Create your views here.

# Views are in charge of 

#
# ORDER
#
class RetrieveOrderView(APIView):

    def get(self,request):
        order = request.order
        order = OrderSerializer(order)
        return Response(order.data, status=status.HTTP_200_OK)


class CreateOrderView(APIView):

    # Taking in JSON from React front-end,
    # which comes in the form of a POST request,
    # and turning it into an object in our Django models database.
    def post(self, request):
        # data retrieved from our cart checkout function
        data = request.data

        serializer = OrderCreateSerializer(data = data)

        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

        order = serializer.create(serializer.validated_data)
        order = OrderSerializer(order)

        print("Order created in models - coldcmerch/shop/views.py")

        return Response(order.data, status=status.HTTP_201_CREATED)
