from django.shortcuts import render
from shop.serializers import OrderCreateSerializer, OrderSerializer, ProductSerializer, CartSerializer, CartItemSerializer, CreateCartItemSerializer, CreateCartSerializer
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response


# Create your views here.


# ORDER

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

# PRODUCT
# (does not need a create view--use '/admin')

class RetrieveProductView(APIView):
    # GET (request) data from Django backend
    def get(self,request):
        product = request.product
        product = ProductSerializer(product)
        return Response(product.data, status=status.HTTP_200_OK)


# CART

class RetrieveCartView(APIView):
    # GET (request) data from Django backend
    def get(self,request):
        cart = request.cart
        cart = CartSerializer(cart)
        return Response(cart.data, status=status.HTTP_200_OK)

class CreateCartView(APIView):
    def post(self, request):
        data = request.data

        serializer = CreateCartSerializer(data = data)

        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

        cart = serializer.create(serializer.validated_data)
        cart = CartSerializer(cart)

        print("Cart created in models - coldcmerch/shop/views.py")

        return Response(cart.data, status=status.HTTP_201_CREATED)
    

# CART ITEM

class RetrieveCartItemView(APIView):
    # GET (request) data from Django backend
    def get(self,request):
        cart_item = request.cart_item
        cart_item = CartItemSerializer(cart_item)
        return Response(cart_item.data, status=status.HTTP_200_OK)


class CreateCartItemView(APIView):
    def post(self, request):
        data = request.data

        serializer = CreateCartItemSerializer(data = data)

        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

        cart_item = serializer.create(serializer.validated_data)
        cart_item = CartItemSerializer(cart_item)

        print("Cart Item created in models - coldcmerch/shop/views.py")

        return Response(cart_item.data, status=status.HTTP_201_CREATED)