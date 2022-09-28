from django.shortcuts import render
from .models import Product
from shop.serializers import OrderCreateSerializer, OrderSerializer, ProductSerializer, CartSerializer, CartItemSerializer, CreateCartItemSerializer, CreateCartSerializer
from shop.models import Cart, CartItem
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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


# request product by its id (1, 2, 3...) (GET)
class RetrieveSingleProductView(APIView):
    # GET (request) data from Django backend
    def get(self,request):
        # Request a single product
        product = request.product
        # Serialize that single product's data into JSON
        product = ProductSerializer(product)
        # Return that JSON 
        return Response(product.data, status=status.HTTP_200_OK)

# request a list of all products (GET)
class RetrieveAllProductView(APIView):

    permission_classes = []
    # GET (request) data from Django backend
    def get(self,request):
        # Filter all products according to their availibility being True only.
        product = Product.objects.filter(available = True)
        # Serialize that data into JSON
        product = ProductSerializer(product, many = True)
        # Return that JSON
        return Response(product.data, status=status.HTTP_200_OK)


# CART


# EXPECTED JSON INPUT:
# {
# "checked_out" : "True/False",
# "my_user" : "#"
# }

class RetrieveCartView(APIView):
    # GET (request) data from Django backend
    permission_classes = [IsAuthenticated]
    def get(self,request):

        
        # grab the request data
        # so that we can determine which user's cart data we want:
        
        data = json.loads(request.body)
        requested_user = data['my_user']

        # Only allow the correct user to access this API:
        requesting_user = str(request.user.id)
        
        if(requested_user != requesting_user):
            print('requested: ', requested_user)
            print('requesting: ',requesting_user)
            return Response({ 'response': "You are attempting to access another user's data."})


        # Only grab the user's last unchecked-out cart.
        # (old carts are used for order fulfillment purposes)
        cart = Cart.objects.filter( checked_out = False, my_user=requested_user ).first()
        # use our serializer to serialize the JSON
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        requested_user = data['my_user']

        # Only allow the correct user to access this API:
        requesting_user = str(request.user.id)
        
        if(requested_user != requesting_user):
            print('requested: ', requested_user)
            print('requesting: ',requesting_user)
            return Response({ 'response': "You are attempting to access another user's data."})

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
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        requested_user = data['my_user']

        # Only allow the correct user to access this API:
        requesting_user = str(request.user.id)
        
        if(requested_user != requesting_user):
            print('requested: ', requested_user)
            print('requesting: ',requesting_user)
            return Response({ 'response': "You are attempting to access another user's data."})
        
        cart = Cart.objects.filter(checked_out = False, my_user = requesting_user).update(checked_out=True)

        return Response(cart.data, status = status)
        

    pass

    

# CART ITEM

class RetrieveCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    # GET (request) data from Django backend
    def get(self,request):
        data = json.loads(request.body)

        # user auth verification/security stuff:
        requested_user = data['my_user']

        # Only allow the correct user to access this API:
        requesting_user = str(request.user.id)
        
        if(requested_user != requesting_user):
            print('requested: ', requested_user)
            print('requesting: ',requesting_user)
            return Response({ 'response': "You are attempting to access another user's data."})

        requested_cart = data['cart']
        cart_item = CartItem.objects.filter(cart = requested_cart,)
        cart_item = CartItemSerializer(cart_item, many=True)
        return Response(cart_item.data, status=status.HTTP_200_OK)


class CreateCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data

        serializer = CreateCartItemSerializer(data = data)

        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

        cart_item = serializer.create(serializer.validated_data)
        cart_item = CartItemSerializer(cart_item)

        print("Cart Item created in models - coldcmerch/shop/views.py")

        return Response(cart_item.data, status=status.HTTP_201_CREATED)