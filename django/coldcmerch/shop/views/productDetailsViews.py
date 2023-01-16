from shop.serializers import ProductSizeSerializer
from shop.models import ProductSize
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import json

# PRODUCT DETAIL VIEWS


#
# SIZES
#
class RetrieveProductSizeView(APIView):
    permission_classes = []

    def post(self, request):
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