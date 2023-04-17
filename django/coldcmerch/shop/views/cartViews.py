from shop.serializers import CartSerializer, CartItemSerializer, \
                CreateCartItemSerializer, \
                CreateCartSerializer
from shop.models import Cart, CartItem, ProductSize, Product
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

        # Check if the requester is an authenticated user (i.e.: logged in)
        if not request.user.is_authenticated:
            # Let them/our front end know by sending a 401 response and a message.
            return Response({'response': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        # Grab the data from the request
        data = request.data

        # Sanity check for the data we're receiving
        print("Add Cart -- Old data, request from Front-End: \n", data)


        # Interpret 'my_user' and 'cart' from the request
        data['my_user'] = request.user.id
        data['cart'] = Cart.objects.get(my_user=request.user, checked_out=False).id


        # Grab the product size price from our backend database:
        # Send a special response if it's not found.
        try:
            # perhaps the size may not exist, either due to front end unexpected behaviors, OR user sends custom JSON.
            product_size_price = ProductSize.objects.get(product_id=data['product'], size=data['size']).added_cost
        except:
            return Response({'response': 'Product Size does not exist. Could not retrieve added cost.'},
                            status=status.HTTP_400_BAD_REQUEST)


        # Check PRODUCT to see if it's eligible to be interpreted
        # Send a special response if it's not found.
        try:
            product_base_cost = Product.objects.get(id=data['product']).base_cost
        except:
            return Response({'response': 'Product does not exist. Could not retrieve base cost.'},
                            status=status.HTTP_400_BAD_REQUEST)
        


        # Check QUANTITY to see if it's eligible to be interpreted
        product_quantity = data['quantity']
        print("Add to Cart -- Quantity RAW: ", product_quantity)
        if not isinstance(product_quantity, int):
            return Response({'response': 'Quantity must be an integer.'},
                status=status.HTTP_400_BAD_REQUEST)
        elif (product_quantity < 1 or product_quantity > 10):
            return Response({'response': 'Quantity must be between 1 and 10.'},
                status=status.HTTP_400_BAD_REQUEST)


        # Calculate the adjusted total and amend it to the data:
        data['adjusted_total'] = ( product_base_cost + product_size_price )  * product_quantity
        print("Product's base cost: ", product_base_cost)
        print("Product's size price: ", product_size_price)
        print("Add to Cart -- Adjusted Total: ", data['adjusted_total'])


        # Print out the data we're sending to the backend
        print("Add to Cart -- New data, for serialization for database: \n", data)

        # Serialize the data and send it to the database
        serializer = CreateCartItemSerializer(data = data)

        # Our serializer will check if the data is valid one last time.
        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

        # Make sure to save the data to the database.
        serializer.save()

        print("Cart Item created in models - coldcmerch/shop/views.py")

        return Response({'item': serializer.data, 'success': True}, status=status.HTTP_201_CREATED)
    

# Remove Cart Item

class DeleteCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):

        # Check if the requester is an authenticated user (i.e.: logged in)
        if not request.user.is_authenticated:
            # Let them/our front end know by sending a 401 response and a message.
            return Response({'response': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data

        # Only allow the correct user to access this API:
        requesting_user = request.user.id
        
        # Attempt to delete the cart item from the database.
        # If it fails, send an error message.
        # Otherwise, send a success message.
        try:
            CartItem.objects.filter(my_user = requesting_user, id = data['cart_item_id']).delete()
        except:
            return Response({'response': 'Could not delete cart item. No such item exists for this user.'},
                status=status.HTTP_400_BAD_REQUEST)

        return Response({'response': 'Item was deleted.'}, status = status.HTTP_204_NO_CONTENT)
        

    pass
    