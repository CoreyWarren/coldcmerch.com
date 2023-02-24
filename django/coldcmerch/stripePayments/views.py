from django.shortcuts import render, redirect
from django.conf import settings
<<<<<<< HEAD
=======
from shop.models import Product
>>>>>>> 438ed31f0f428d130ca24a7319526d923cf1ae04

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stripePayments import StripeProductCreateSerializer

from django.http import HttpResponseRedirect

import stripe

# Create your views here.

stripe.api_key = "sk_test_51LjuaCGd7lKiUeBG96lJyjaK3IBvHV8NiN5jEedBaEHCckHCPjtM9y4UvL2OJWoJGmUelzIGKIORI5SlxD3u4KLw00LwKsKndb"

<<<<<<< HEAD
# https://stripe.com/docs/api/products/create
class StripeCreateProductView(APIView):
    def post(self, request):

        product = request.product
        product = StripeProductCreateSerializer(product)

        product_name = ""
        product_description = ""
        product_active = ""
        product_images = ""


        stripe.Product.create(
            name=product_name,
            description = product_description,
            active = product_active,
            images = product_images,
        )

        results_message = ""

        return results_message
=======
# https://stripe.com/docs/api/payment_intents/create
class StripeCreatePaymentIntentView(APIView):
    def post(self, request):

        cart_items = request.data.get('cart_items')
        payment_method = request.data.get('payment_method')
        currency = request.data.get('currency')
        metadata = request.data.get('metadata')
        receipt_email = request.data.get('receipt_email')

        price_sum = 0

        for single_cart_item in cart_items:
            single_item_cost = single_cart_item['adjusted_total']
            item_quantity = single_cart_item['quantity']
            price_sum += single_item_cost * item_quantity

        # price_sum is now calculated.

        stripe.PaymentIntent.create(
            amount=price_sum,
            currency='usd',
            payment_method=payment_method,
            receipt_email=receipt_email,
        )

        return Response( {'message': 'Payment intent created'}, status=status.HTTP_200_OK )
>>>>>>> 438ed31f0f428d130ca24a7319526d923cf1ae04
        

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
