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


# EXPECTED JSON INPUT:
# {
# "checked_out" : "True/False",
# "my_user" : "#"
# }

# Grab our CART
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

class RetrieveCartItemView(APIView):

    # NOTE TO COREY:
    # This is not secure. (Feb 22, 2023)
    # If I were a malicious actor, I could:
    # 1. Pretend to be user X
    # 2. Put User X's user ID into the body of the request
    # 3. Put the cart ID of user X into the body of the request
    # 4. Check out the cart of user X, who they are not.

    # This LOOKS secure, but actually is not.
    # This only checks to see if the user ID in the request body,
    # and if the requesting actor is authenticated.

    # If our bad actor is authenticated, then
    # they can access any user's cart data.
    # and check out any user's cart. (with this current implementation).

    permission_classes = [IsAuthenticated]

    
    # GET (request) data from Django backend
    def get(self,request):

        # Check if the requester is an authenticated user (i.e.: logged in)
        if not request.user.is_authenticated:
            # Let them/our front end know by sending a 401 response and a message.
            return Response({'response': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Only give results that belong to the currently requesting User.
        cart_items = CartItem.objects.filter(cart__user=request.user)

        # Serialize the items so that they can be sent to the frontend.
        # This formats the data into JSON. 
        cart_items = CartItemSerializer(cart_items, many=True)

        return Response(cart_items.data, status=status.HTTP_200_OK)


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