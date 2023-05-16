from django.shortcuts import render, redirect
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from shop.serializers import CartItemSerializer
from shop.models import Cart, Product, ProductSize, CartItem

from django.http import HttpResponseRedirect

import stripe
from django.conf import settings
from django.db import transaction, OperationalError


# Create your views here.

stripe.api_key = settings.STRIPE_PRIVATE_KEY

# https://stripe.com/docs/api/payment_intents/create
class StripeCreatePaymentIntentView(APIView):

    permission_classes = [IsAuthenticated]
    # todo:
        # 1. Consider the situation where the user has a payment intent already created.
    def post(self, request):

        # Grab the data from the front-end's request.
        try:
            cart_items          = request.data.get('cart_items')
            # payment_method      = request.data.get('payment_method')
            currency            = request.data.get('currency')
            # metadata          = request.data.get('metadata')
            # shipping_info       = request.data.get('shipping_info')
            receipt_email       = request.data.get('receipt_email')
        except:
            return Response(
                {'error': 'Missing required fields for payment intent creation request.'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        print("cart_items: ", cart_items)


        # Serialize each cart item.
        cart_items_serializer = CartItemSerializer(data=cart_items, many=True)
        if cart_items_serializer.is_valid():
            cart_items = cart_items_serializer.data
        else:
            return Response(
                {'error': 'Error serializing cart items data.'},
                status=status.HTTP_400_BAD_REQUEST
            )


        # Start to track the total of the cart items' prices.
        price_sum = 0


        # Iterate through each cart item, and add the price to the total.
        # fields = ('cart', 'product', 'adjusted_total', 'color', 'size', 'quantity', 'my_user')

        for single_cart_item in cart_items:

            # Grab the adjusted total from each cart item:
            single_item_cost = single_cart_item['adjusted_total']
            item_quantity = single_cart_item['quantity']

            # Sum = cost of each of this type of item, TIMES the quantity of that item.
            price_sum           += single_item_cost * item_quantity


        price_sum = int(price_sum) * 100


        # Search for this user's cart.
        try:
            related_cart = Cart.objects.get(checked_out=False, my_user=request.user)
            related_cart_id = related_cart.id
        except Cart.DoesNotExist:
            return Response(
                {'error': 'No active cart found for this user.'},
                status=status.HTTP_400_BAD_REQUEST
            )



        metadata = {"cart_id": related_cart_id}


        # --> TODO:
        # CALCULATE THE AVAILABILE_AMOUNT VERSUS REQUESTED AMOUNT OF EACH PRODUCT_SIZE IN THE CART.
        # IF THE REQUESTED AMOUNT IS GREATER THAN THE AVAILABLE AMOUNT, THEN RETURN AN ERROR.


        # Create the payment intent.
        payment_intent = stripe.PaymentIntent.create(
            amount              = price_sum,
            currency            = currency,
            payment_method_types= ['card'],
            metadata            = metadata,
            # shipping          = shipping_info,
            receipt_email       = receipt_email,
        )

        # Retrieve the client secret from the payment intent
        clientSecret = payment_intent.client_secret
        # Handling the client secret properly:
        # 1. Do not log the client secret.
        # 2. Do not embed the client secret in the URL.
        # 3. Only expose this secret to the client.
        # 4. Make sure that your page is secured with TLS (HTTPS) on any page that includes the client secret.


        # Todo: Consider routing the user to the payment page here.

        # return a response with the client secret. 
        return Response( {'client_secret': clientSecret}, status=status.HTTP_200_OK )
        # This is used to confirm the user's intent to make a payment,
        # Get it? Intent? Payment Intent? That's where it comes from!
        


class StripeListAllActiveProductsView(APIView):
    def get(self,request):
        all_active_stripe_products = stripe.Product.list(active=True)
        return all_active_stripe_products



# Let Stripe tell us when a payment intent has succeeded.
# This allows us to only checkout a user's cart when the payment intent has succeeded.

@csrf_exempt
def order_confirmation_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None
    stripe_webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, stripe_webhook_secret
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the event

    # Note: This part of the code has very little error handling.
    # All error handling should be done in other parts of the code.
    # For example:
        # In the Checkout code.
        # In the Stripe payment intent creation code.

    if event.type == 'payment_intent.processing':
        with transaction.atomic():
            payment_intent = event.data.object
            confirmed_cart_id = payment_intent.metadata.get('cart_id')

            try:
                confirmed_cart = Cart.objects.select_for_update().get(id=confirmed_cart_id, checked_out=False)
            except:
                return HttpResponse("The cart does not exist or has already been checked out.", status=HTTP_400_BAD_REQUEST)

            try:
                cart_items = CartItem.objects.select_for_update().filter(cart=confirmed_cart.id)
            except:
                return HttpResponse("The cart does not have any items.", status=HTTP_400_BAD_REQUEST)
            
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
                    some_product = Product.objects.select_for_update().get(id=item['product'])
                except Product.DoesNotExist:
                    return Response({"success": False, 
                        "message": f"Product with id {item['product']} does not exist.",
                        "database_error": True},
                        status=status.HTTP_400_BAD_REQUEST)
                except OperationalError:
                # Handle the case where the items are already locked by another transaction
                    return Response({"success": False, 
                        "message": "The item is currently being purchased by another user. Please try again later."},
                        status=status.HTTP_409_CONFLICT)

                # Get the size of the product from the cart item
                item_size = item['size']

                try:
                    # Fetch the ProductSize instance using the fetched product and size
                    # select_for_update() is used to lock the row in the database, so that no other user can access it until the transaction is complete.
                    some_product_size = ProductSize.objects.select_for_update().get(product=some_product, size=item_size)
                except ProductSize.DoesNotExist:
                    return Response({"success": False, 
                        "message": f"ProductSize with product id {item['product']} and size {item_size} does not exist.",
                        "database_error": True},
                        status=status.HTTP_400_BAD_REQUEST)
                except OperationalError:
                # Handle the case where the items are already locked by another transaction
                    return Response({"success": False, 
                        "message": "The item is currently being purchased by another user. Please try again later."},
                        status=status.HTTP_409_CONFLICT)


                # Get the quantity of the product requested from the cart item
                requested_amount = item['quantity']

                # Check if the product size id is already present in item_stock_dict
                if some_product_size.id not in item_stock_dict:
                    # If not, then add it to the item_stock_dict with the available amount from the product size
                    item_stock_dict[some_product_size.id] = some_product_size.available_amount

                    # Also add it to the total_requested_dict with the requested amount
                    total_requested_dict[some_product_size.id] = requested_amount
                else:
                    # No need to update the available amount in item_stock_dict, since it will be the same for all cart items of the same product size
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
            # End of FOR LOOP (for item in cart_items)
            # (All cart items have been processed at this point)
            # (And the database has been locked for all the rows that were fetched)
            # (And the item_stock_dict and total_requested_dict have been populated)
            # (And the out_of_stock_items list has been populated if any item was out of stock)
            # (And the success flag has been set to True if all items were in stock, and False if any item was out of stock)
            # (And the database_error flag has been set to True if any database error occurred)

            if success==False:
                # Not enough stock, cancel the payment intent
                stripe.PaymentIntent.cancel(payment_intent.id)
                return HttpResponse({"message":"Sorry, the item was bought by another customer while you were checking out. Your payment has been cancelled.",
                                     "success":success, #(false)
                                     "out_of_stock_items": out_of_stock_items},
                                     status=409)
            else:
            # If everything is OK, confirm the PaymentIntent to finalize the payment
                try:
                     stripe.PaymentIntent.confirm(payment_intent.id)
                except stripe.error.StripeError as e:
                    return HttpResponse({"message": "Error confirming the payment. Please try again later.",
                            "stripe_error": str(e)},
                        status=HTTP_500_INTERNAL_SERVER_ERROR)

    



    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object  # contains a stripe.PaymentIntent
        # Then perform your desired actions based on the payment intent

        confirmed_cart_id = payment_intent.metadata.get('cart_id')
        print("confirmed_cart_id: ", confirmed_cart_id)


        confirmed_cart = Cart.objects.get(id=confirmed_cart_id)

        # Check out the user's current cart, and save that change.
        confirmed_cart.checked_out = True
        confirmed_cart.save()

        new_cart = Cart.objects.create(my_user=confirmed_cart.my_user, checked_out=False, cart_item=None)
        new_cart.save()

        print("After confirmation: confirmed_cart.checked_out = ", confirmed_cart.checked_out)

        print("User has new empty cart? TRUE/FALSE:", new_cart.id is not None)

        # Next, change the stocks of each product size.

        # Find each cart item related to that cart again:

        cart_items = CartItem.objects.filter(cart=confirmed_cart.id)

        print("cart_items: ", cart_items)

        for item in cart_items:
                
            item_product_id = item.product
            item_size = item.size

            product_size = ProductSize.objects.get(product_id=item_product_id, size=item_size)

            product_size.available_amount -= item.quantity
            product_size.save()

            print("product, product_size, and available_amount: ", item_product_id, ": ", item_size, ": ", product_size.available_amount)

        print('PaymentIntent was successful!')
        print('Cart checked out!')
        print('Product availability amounts updated!')

    elif event.type == 'payment_method.attached':
        payment_method = event.data.object  # contains a stripe.PaymentMethod
        # Then perform your desired actions based on the payment method
        print('PaymentMethod was attached to a Customer!')
    # ... handle other event types
    else:
        # Unexpected event type
        return HttpResponse(status=400)

    return HttpResponse(status=200)