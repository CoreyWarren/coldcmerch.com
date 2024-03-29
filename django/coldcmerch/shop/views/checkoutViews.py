from django.shortcuts import render
from shop.models import Product
from shop.models import Cart, CartItem, ProductSize
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction, OperationalError
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

class CheckoutStockValidationView(APIView):

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


    def get(self, request):
        # Transaction.atomic() is used to ensure that all database operations are completed successfully, or none of them are.
        # This is useful because we are making multiple database operations in this view.
        # Additionally, if MULTIPLE USERS are trying to checkout at the same time, we don't want to run into any issues with the database.
        # transaction.atomic() will roll back all database operations if any of them fail.
        print("CheckoutStockValidationView GET request received.")
        with transaction.atomic():
            # user comes in with cookie/access token, so this is still a GET request:
            this_user_id = request.user.id

            print("this_user: ", this_user_id)

            # I didn't want to have to POST cart items data, so
            # let's just grab it from our database:
            try:
                cart_items = CartItem.objects.select_for_update().filter(cart__my_user=this_user_id, cart__checked_out = False)
            except:
                print("There was an error retrieving your cart items.")
                return Response({"success": False, 
                    "message": "There was an error retrieving your cart items.",
                    "database_error": True},
                    status=status.HTTP_400_BAD_REQUEST)

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
                    # select_for_update() is used to lock the row in the database, so that no other user can access it until the transaction is complete.
                    some_product = Product.objects.select_for_update().get(id=item.product_id)
                except Product.DoesNotExist:
                    print(f"Product with id {item.product_id} does not exist.")
                    return Response({"success": False, 
                        "message": f"Product with id {item.product_id} does not exist.",
                        "database_error": True},
                        status=status.HTTP_400_BAD_REQUEST)
                except OperationalError:
                # Handle the case where the items are already locked by another transaction
                    return Response({"success": False, 
                        "message": "The item is currently being purchased by another user. Please try again later."},
                        status=status.HTTP_409_CONFLICT)

                # Get the size of the product from the cart item
                item_size = item.size

                try:
                    # Fetch the ProductSize instance using the fetched product and size
                    # select_for_update() is used to lock the row in the database, so that no other user can access it until the transaction is complete.
                    some_product_size = ProductSize.objects.select_for_update().get(product_id=some_product, size=item_size)
                except ProductSize.DoesNotExist:
                    print(f"ProductSize with product id {item.product_id} and size {item_size} does not exist.")
                    return Response({"success": False, 
                        "message": f"ProductSize with product id {item.product_id} and size {item_size} does not exist.",
                        "database_error": True},
                        status=status.HTTP_400_BAD_REQUEST)
                except OperationalError:
                # Handle the case where the items are already locked by another transaction
                    return Response({"success": False, 
                        "message": "The item is currently being purchased by another user. Please try again later."},
                        status=status.HTTP_409_CONFLICT)


                # Get the quantity of the product requested from the cart item
                requested_amount = item.quantity

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

                    try:
                        # retrieve the remaining stock for this product size:
                        remaining_stock = ProductSize.objects.get(id=some_product_size.id).available_amount
                    except ProductSize.DoesNotExist:
                        print(f"ProductSize with id {some_product_size.id} does not exist.")
                        return Response({"success": False, 
                            "message": f"ProductSize with id {some_product_size.id} does not exist.",
                            "database_error": True},
                            status=status.HTTP_400_BAD_REQUEST)
                    
                    out_of_stock_items.append({
                        "product": item.product_id,
                        "size": item.size,
                        "adjusted_total": item.adjusted_total,
                        "quantity": total_requested_dict[some_product_size.id],
                        "available_quantity": remaining_stock
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
                print(response)
                return Response(response, status=status.HTTP_200_OK)
            
            else:
                response["message"] = "Some items are not in stock."
                response["out_of_stock_items"] = out_of_stock_items
                print(response)
                return Response(response, status=status.HTTP_409_CONFLICT)