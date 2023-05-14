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


        cart_items = request.cart_items
        this_user = request.user


        # Process:

        # For each item in request.cart_items, check if the product is in stock compared to the amount that the user is ordering. 

        item_stock_dict = {}
        out_of_stock_items = []
        # {product_size_id: X, stock_left: Y}

        # assemble the quantity for each type of product size in the cart
        # We will need to do some calculations after this for statement,
        # In order to check if the requested amount is available in stock.
        for item in cart_items:
            some_product = Product.objects.get(id=item['product'])
            item_size = item['size']
            some_product_size = ProductSize.objects.get(product=some_product, size=item_size)

            requested_amount = item['quantity']

            if some_product_size.id not in item_stock_dict:
                item_stock_dict[some_product_size.id] \
                    = some_product_size.available_amount - requested_amount
                
                if item_stock_dict[some_product_size.id] < 0:
                    out_of_stock_items.append({
                        "product": item['product'],
                        "size": item['size'],
                        "adjusted_total": item['adjusted_total'],
                        "quantity": item['quantity'],
                        "available_quantity": some_product_size.available_amount
                    })
                    success = False

            else:
                item_stock_dict[some_product_size.id] -= requested_amount





        # If it is, then proceed. If not, then return a message saying that the product is out of stock, and specify which product and size it is!

        # So, we will need to calculate and return these:
        ###
        # 1. In stock or not? (True/False)
        ###




        ###
        # 2. If not (1/2), then which product and size is out of stock?
        ###



        ###
        # 3. If not (2/2), then how many are in stock?
        ###








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