from django.shortcuts import render
from shop.models import Product
from shop.serializers import ProductSerializer
from shop.models import Cart, CartItem, ProductSize
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json


# PRODUCT
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


