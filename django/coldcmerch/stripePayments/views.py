from django.shortcuts import render, redirect
from django.conf import settings

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

    permission_classes = []
    # todo:
        # 1. Consider the situation where the user has a payment intent already created.
    def post(self, request):

        # Grab the data from the front-end's request.
        try:
            cart_items          = request.data.get('cart_items')
            payment_method      = request.data.get('payment_method')
            currency            = request.data.get('currency')
            # metadata          = request.data.get('metadata')
            shipping_info       = request.data.get('shipping_info')
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

        # NO. DO NOT take the price from the front-end!
        # The price could be changed on the client side if you accepted a price from the front-end!

        # 1. Get the product.
        # 2. Retrieve the price from the product.
        
        # 3. Get the product's size.
        # 4. Retrieve the price from the product's size!

        # 5. Add the product size's price to the product's price.
        # 6. Retrieve the sum.
        for single_cart_item in cart_items:

            # Note to self: Create an API view to retrieve Cart Items
            related_product     = single_cart_item['product']['id']
            related_size        = single_cart_item['size']['id']

            related_product_cost    = Product.objects.get(id=related_product).base_cost
            related_size_cost       = ProductSize.objects.get(id=related_size).added_cost

            # Add the two costs together
            single_item_cost    = related_product_cost + related_size_cost

            item_quantity       = single_cart_item['quantity']

            # Sum = cost of each of this type of item, TIMES the quantity of that item.
            price_sum           += single_item_cost * item_quantity


        # Create the payment intent.
        stripe.PaymentIntent.create(
            amount              = price_sum,
            currency            = currency,
            payment_method      = payment_method,
            # metadata          = metadata,
            shipping            = shipping_info,
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

