from django.shortcuts import render, redirect
from django.conf import settings
from shop.models import Product

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stripePayments import StripeProductCreateSerializer

from django.http import HttpResponseRedirect

import stripe

# Create your views here.

stripe.api_key = "sk_test_51LjuaCGd7lKiUeBG96lJyjaK3IBvHV8NiN5jEedBaEHCckHCPjtM9y4UvL2OJWoJGmUelzIGKIORI5SlxD3u4KLw00LwKsKndb"

# https://stripe.com/docs/api/payment_intents/create
class StripeCreatePaymentIntentView(APIView):
    def post(self, request):

        products_purchasing = request.data.get('product_ids')
        payment_method = request.data.get('payment_method')

        price_sum = 0

        for item in products_purchasing:
            this_product = Product.objects.filter(pk=item['product_id'])
            some_price = this_product.price
            # some_price += this_product.related_sizes_n_junk.price
            price_sum += some_price

        # price_sum is now calculated.

        stripe.PaymentIntent.create(
            amount=price_sum,
            currency='usd',
            payment_method=payment_method
        )


        return Response( {'message': 'Payment intent created'}, status=status.HTTP_200_OK )
        

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
