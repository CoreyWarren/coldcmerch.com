from shop.serializers import CartSerializer, CartItemSerializer, \
                CreateCartItemSerializer, \
                CreateCartSerializer
from shop.models import Cart, CartItem
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json


#
# CART VIEWS
#



# Grab our CART
class RetrieveCartView(APIView):
    # GET (request) data from Django backend
    permission_classes = [IsAuthenticated]
    def get(self,request):

        # Check if the requester is an authenticated user (i.e.: logged in)
        if not request.user.is_authenticated:
            # Let them/our front end know by sending a 401 response and a message.
            return Response({'response': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Only give results that belong to the currently requesting User.
        this_cart = Cart.objects.filter(my_user=request.user, checked_out=False).first()

        # Serialize the items so that they can be sent to the frontend.
        # This formats the data into JSON. 
        this_cart = CartSerializer(this_cart, many=False)

        print()
        print(this_cart.data)
        print()


        return Response(this_cart.data, status=status.HTTP_200_OK)

#
# CREATE CART
#
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

class RetrieveCartItemsView(APIView):

    permission_classes = [IsAuthenticated]

    # GET (request) data from Django backend
    def get(self,request):

        # Check if the requester is an authenticated user (i.e.: logged in)
        if not request.user.is_authenticated:
            # Let them/our front end know by sending a 401 response and a message.
            return Response({'response': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Only give results that belong to the currently requesting User.
        cart_items = CartItem.objects.filter(cart__my_user=request.user, cart__checked_out=False)

        # Serialize the items so that they can be sent to the frontend.
        # This formats the data into JSON. 
        cart_items = CartItemSerializer(cart_items, many=True)

        return Response(cart_items.data, status=status.HTTP_200_OK)


    
# ADD TO CART
# CREATE CART ITEM
# fields = ('cart', 'product', 'adjusted_total', 'size', 'quantity', 'my_user')
class CreateCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        if not request.user.is_authenticated:
            # Let them/our front end know by sending a 401 response and a message.
            return Response({'response': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data

        print(data)

        data['my_user'] = request.user.id
        data['cart'] = Cart.objects.filter(my_user=request.user, checked_out=False).first().id

        print(data)

        serializer = CreateCartItemSerializer(data = data)

        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

        serializer.save()

        print("Cart Item created in models - coldcmerch/shop/views.py")

        return Response(status=status.HTTP_201_CREATED)
    