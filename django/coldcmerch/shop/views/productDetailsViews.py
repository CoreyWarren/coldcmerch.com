from shop.serializers import ProductSizeSerializer
from shop.models import ProductSize
from shop.models import Product
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import json

# PRODUCT DETAIL VIEWS


#
# SIZES
#
class RetrieveProductSizeView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        # Add all product size objects to our list:
        sizes = ProductSize.objects.all()
        # Serialize that data into JSON:
        sizes = ProductSizeSerializer(sizes, many = True)
        # Return our JSON to the front end.
        return Response(sizes.data, status=status.HTTP_200_OK)
