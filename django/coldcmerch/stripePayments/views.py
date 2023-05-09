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