from django.shortcuts import render
from shop.models import Product
from shop.models import Cart, CartItem, ProductSize
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# CHECKOUT VIEWS

#
# CHECKOUT
#

# We need to create a view that will tell the Front End
# whether or not what the customer has ordered
# is in stock or not. If it is, then we can proceed (via front end).

# This view will be called by the front end when the user
# clicks the "Checkout" button.

class CheckoutValidateStock(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Input:

        # request.user
        # request.cart_items

        # request.cart_items is an array of objects that look like this:
        # {
        #    "product": 1,
        #    "size": "S",
        #    "adjusted_total": 20,
        #    "quantity": 1
        # }

        # Process:

        # For each item in request.cart_items, check if the product is in stock compared to the amount that the user is ordering. 
        # If it is, then proceed. If not, then return a message saying that the product is out of stock, and specify which product and size it is!

        # So, we will need to calculate and return these:
        # 1. In stock or not? (True/False)
        # 2. If not (1/2), then which product and size is out of stock?
        # 3. If not (2/2), then how many are in stock?

        # Output:

        # {
        # "success": true,
        # "message": "All items are in stock."
        # }

        # OR

        # {
        #     "success": false,
        #     "message": "Some items not in stock.",
        #     "out_of_stock_items": [
        #         {
        #             "product": 1,
        #             "size": "S",
        #             "adjusted_total": 20,
        #             "quantity": 3
        #             "available_quantity": 2
        #         },
        #         {
        #             "product": 2,
        #             "size": "M",
        #             "adjusted_total": 20,
        #             "quantity": 3
        #             "available_quantity": 2
        #         }
        #     ]
        # }

        ########################################
        success = True
        response = {
            "success": success,
        }
        if (success):
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(response, status=status.HTTP_400_BAD_REQUEST)