from django.shortcuts import render
from shop.models import Product
from shop.models import Cart, CartItem, ProductSize
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
import json

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

        # {product_size_id: X, stock_left: Y}

        # assemble the quantity for each type of product size in the cart
        # We will need to do some calculations after this for statement,
        # In order to check if the requested amount is available in stock.




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

    permission_classes = [IsAuthenticated]


    def post(self, request):
        # Transaction.atomic() is used to ensure that all database operations are completed successfully, or none of them are.
        # This is useful because we are making multiple database operations in this view.
        # Additionally, if MULTIPLE USERS are trying to checkout at the same time, we don't want to run into any issues with the database.
        # transaction.atomic() will roll back all database operations if any of them fail.
        with transaction.atomic():
            cart_items = request.data['cart_items']
            this_user = request.user

            # item_stock_dict is used to keep track of the remaining stock for each product size.
            item_stock_dict = {}
            
            # total_requested_dict is used to keep track of the total quantity requested for each product size.
            total_requested_dict = {}
            
            # out_of_stock_items is a list that will hold dictionaries of out of stock items,
            # where each dictionary contains the product, size, adjusted total, quantity requested, and available quantity.
            out_of_stock_items = []
            
            # success is a boolean flag that will remain True if all items are in stock, and False if any item is out of stock.
            success = True
            database_error = False



            # Loop over each item in the cart
            for item in cart_items:
                try:
                    # Fetch the Product instance using the product id from the cart item
                    some_product = Product.objects.get(id=item['product'])
                except Product.DoesNotExist:
                    return Response({"success": False, 
                        "message": f"Product with id {item['product']} does not exist.",
                        "database_error": True},
                        status=status.HTTP_400_BAD_REQUEST)

                # Get the size of the product from the cart item
                item_size = item['size']

                try:
                    # Fetch the ProductSize instance using the fetched product and size
                    some_product_size = ProductSize.objects.get(product=some_product, size=item_size)
                except ProductSize.DoesNotExist:
                    return Response({"success": False, 
                        "message": f"ProductSize with product id {item['product']} and size {item_size} does not exist.",
                        "database_error": True},
                        status=status.HTTP_400_BAD_REQUEST)


                # Get the quantity of the product requested from the cart item
                requested_amount = item['quantity']

                # Check if the product size id is already present in item_stock_dict
                if some_product_size.id not in item_stock_dict:
                    # If not, then add it to the item_stock_dict with the available amount from the product size
                    item_stock_dict[some_product_size.id] = some_product_size.available_amount

                    # Also add it to the total_requested_dict with the requested amount
                    total_requested_dict[some_product_size.id] = requested_amount
                else:
                    # If the product size id is already present, then increment the total requested amount in total_requested_dict
                    total_requested_dict[some_product_size.id] += requested_amount

                # Check if the available stock for the product size is greater than or equal to the requested amount
                if item_stock_dict[some_product_size.id] - requested_amount >= 0:
                    # If yes, then subtract the requested amount from the available stock in item_stock_dict
                    item_stock_dict[some_product_size.id] -= requested_amount
                else:
                    # If not, then append the cart item to the out_of_stock_items list,
                    # with additional fields for total requested quantity and available quantity,
                    # and set the success flag to False
                    out_of_stock_items.append({
                        "product": item['product'],
                        "size": item['size'],
                        "adjusted_total": item['adjusted_total'],
                        "quantity": total_requested_dict[some_product_size.id],
                        "available_quantity": item_stock_dict[some_product_size.id]
                    })
                    success = False

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

            response = {"success": success}
            response["database_error"] = database_error

            if success:
                response["message"] = "All items are in stock."
                return Response(response, status=status.HTTP_200_OK)
            
            else:
                response["message"] = "Some items are not in stock."
                response["out_of_stock_items"] = out_of_stock_items
                return Response(response, status=status.HTTP_409_CONFLICT)