from django.shortcuts import render
from shop.serializers import OrderCreateSerializer, OrderSerializer, ProductSerializer, CartSerializer, CartItemSerializer, CreateCartItemSerializer, CreateCartSerializer
from shop.models import Cart, CartItem
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
import json


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


# EXPECTED JSON INPUT:
# {
# "checked_out" : "True/False",
# "my_user" : "#"
# }
class RetrieveCartView(APIView):
    # GET (request) data from Django backend
    def get(self,request):
        # grab the request data
        # so that we can determine which user's cart data we want:
        data = json.loads(request.body)
        requested_user = data['my_user']
        # use our serializer
        cart = Cart.objects.filter( checked_out = False, my_user=requested_user ).first()
        cart = CartSerializer(cart)
        # return it along with a 200_ok response
        # EXPECTED OUTPUT:
        # cart items, final total.
        return Response(cart.data, status=status.HTTP_200_OK)


# EXPECTED JSON INPUT:
# {
# "checked_out" : "True/False",
# "cart_item": "#",
# "my_user" : "#"
# }
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

# We need to be able to checkout our cart,
# so that an order can be assigned to it,
# and that order can be processed
class CheckoutCartView(APIView):
    def post(self, request):
        pass
    pass

    

# CART ITEM

class RetrieveCartItemView(APIView):
    # GET (request) data from Django backend
    def get(self,request):
        data = json.loads(request.body)
        requested_cart = data['cart']
        cart_item = CartItem.objects.filter(cart = requested_cart,)
        cart_item = CartItemSerializer(cart_item, many=True)
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