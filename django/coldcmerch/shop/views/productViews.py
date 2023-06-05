from shop.models import Product
from shop.serializers import ProductSerializer
from rest_framework.views import APIView
from rest_framework import  status
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

import json


# PRODUCT VIEWS



# (does not need a create view--use '/admin')
#
# request product by its id (1, 2, 3...) (GET)
#
class RetrieveSingleProductView(APIView):
    # GET (request) data from Django backend
    def get(self,request):
        # Request a single product
        product = request.product
        # Serialize that single product's data into JSON
        product = ProductSerializer(product)
        # Return that JSON 
        return Response(product.data, status=status.HTTP_200_OK)

#
# request a list of all products (GET)
#
class RetrieveAllProductView(APIView):

    authentication_classes = []
    permission_classes = []
    # GET (request) data from Django backend
    def get(self,request):
        # Filter all products according to their availibility being True only.
        product =  Product.objects.filter(available = True)
        # product = Product.objects.filter(available = True)
        # Serialize that data into JSON
        # product.sizes = Object.FindAll(productsizes whos product=this)
        product = ProductSerializer(product, many = True)
        # Return that JSON
        return Response(product.data, status=status.HTTP_200_OK)
    

class RetrieveProductsUsingIDs(APIView):
    # Retrieve only objects from a list of product IDs. 
    # (We never have to send the user's number ID this way when retrieving cart-related products!)
    # (This is done to avoid having to send the entire product list to the front end.)
    # (This would be a waste of bandwidth and overall just very costly.)

    permission_classes = []

    def post(self,request):

        # Retrieve our list of IDs.
        product_ids = request.data.get('product_ids', [])

        products_list_data = []

        # Filter our products by the IDs we received.
        # products_list = Product.objects.filter(id__in=product_ids)
        # /\ Old method, does not duplicate the product if it is in the cart twice.
        # We want this because we're going by INDEX in the frontend.

        # New method, duplicates the product if it is in the cart twice.
        for identifier_item in product_ids:
            products_list_data.append(Product.objects.get(id=identifier_item))

        # old method returns: [product[1], product[2]]
        # new method returns: [product[1], product[2], product[1], product[2]]

        # Serialize the items so that they can be sent to the frontend.
        # (This is put outside of our loop to save cost)
        products_list_data = ProductSerializer(products_list_data, many=True)

        result = products_list_data.data

        # Return response to our front-end.
        return Response({'products': result})


