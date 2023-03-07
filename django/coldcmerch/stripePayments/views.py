from django.shortcuts import render, redirect
from django.conf import settings
<<<<<<< HEAD
=======
from shop.models import Product
from shop.serializers import CartItemSerializer
>>>>>>> 438ed31f0f428d130ca24a7319526d923cf1ae04

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stripePayments import StripeProductCreateSerializer

from django.http import HttpResponseRedirect

import stripe
from django.conf import settings


# Create your views here.

stripe.api_key = "sk_test_51LjuaCGd7lKiUeBG96lJyjaK3IBvHV8NiN5jEedBaEHCckHCPjtM9y4UvL2OJWoJGmUelzIGKIORI5SlxD3u4KLw00LwKsKndb"

=======
# https://stripe.com/docs/api/payment_intents/create
class StripeCreatePaymentIntentView(APIView):

    # todo:
        # 1. Consider the situation where the user has a payment intent already created.
    def post(self, request):

        # Grab the data from the front-end's request.
        try:
            cart_items          = request.data.get('cart_items')
            payment_method      = request.data.get('payment_method')
            currency            = request.data.get('currency')
            # metadata          = request.data.get('metadata')
            receipt_email       = request.data.get('receipt_email')
        except:
            return Response(
                {'error': 'Missing required fields'},
                status = status.HTTP_400_BAD_REQUEST
            )


        # Serialize each cart item.
        cart_items = CartItemSerializer(cart_items, many=True)


        # Start to track the total of the cart items' prices.
        price_sum = 0


        # Iterate through each cart item, and add the price to the total.
        # fields = ('cart', 'product', 'adjusted_total', 'color', 'size', 'quantity', 'my_user')
        for single_cart_item in cart_items:
            single_item_cost    = single_cart_item['adjusted_total']
            item_quantity       = single_cart_item['quantity']
            price_sum           += single_item_cost * item_quantity


        # Create the payment intent.
        stripe.PaymentIntent.create(
            amount              = price_sum,
            currency            = currency,
            payment_method      = payment_method,
            # metadata          = metadata,
            receipt_email       = receipt_email,
        )

        # Retrieve the client secret from the payment intent
        clientSecret = stripe.PaymentIntent.client_secret
        # Handling the client secret properly:
        # 1. Do not log the client secret.
        # 2. Do not embed the client secret in the URL.
        # 3. Only expose this secret to the client.
        # 4. Make sure that your page is secured with TLS (HTTPS) on any page that includes the client secret.


        # Todo: Consider routing the user to the payment page here.

        # return a response with the client secret. 
        return Response( {'client': clientSecret}, status=status.HTTP_200_OK )
        # This is used to confirm the user's intent to make a payment,
        # Get it? Intent? Payment Intent? That's where it comes from!
        




class StripeListAllActiveProductsView(APIView):
    def get(self,request):
        all_active_stripe_products = stripe.Product.list(active=True)
        return all_active_stripe_products




class StripeCheckoutView(APIView):
    def post(self, request):
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': '{{PRICE_ID}}',
                        'quantity': 1,
                    },

                ],
                payment_method_types=[
                    'card',
                    'acss_debit',
                ],
                mode='payment', #payment, subscription, setup 
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?cancelled=true',
            )

            
            return redirect(checkout_session.url)

        except:
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )
