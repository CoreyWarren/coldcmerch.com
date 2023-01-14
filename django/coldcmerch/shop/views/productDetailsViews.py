from django.shortcuts import render
from shop.models import Product
from shop.serializers import ProductSizeSerializer
from shop.models import Cart, CartItem, ProductSize
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json

#
# SIZES
#
class RetrieveProductSizeView(APIView):
    permission_classes = []

    def get(self, request):
        # Load the data so that it's an object rather than JSON
        data = json.loads(request.body)
        # Extract the ID from that object.
        requested_product_id = data['product_id']
        # Get just the size objects for the requested object id
        sizes = ProductSize.objects.filter(product_id = requested_product_id)
        # Serialize our data into JSON
        sizes = ProductSizeSerializer(sizes, many = True)
        # Return our JSON to the front end.
        return Response(sizes.data, status=status.HTTP_200_OK)