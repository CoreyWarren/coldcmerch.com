from django.shortcuts import render, redirect
from django.conf import settings
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from shop.serializers import CartItemSerializer
from shop.models import Product, ProductSize

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


        # Create the payment intent.
        payment_intent = stripe.PaymentIntent.create(
            amount              = price_sum,
            currency            = currency,
            payment_method_types= ['card'],
            # metadata          = metadata,
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
        


class StripeConfirmPaymentIntentView(APIView):
    def post(self, request):
    
        stripe.PaymentIntent.confirm (
        "pi_1Dt1il2eZvKYlo2C6be18kK8",
        payment_method="pm_card_visa",
        )
        
        return Response( {"s": "a"}, status=status.HTTP_200_OK )
        



class StripeListAllActiveProductsView(APIView):
    def get(self,request):
        all_active_stripe_products = stripe.Product.list(active=True)
        return all_active_stripe_products

