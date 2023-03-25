# shop/serializers.py

# The specific functions of this serializer are to:
#
# > Grab Product Data from the Django backend and push it to the React frontend
# > Grab Order Data...''
# > Grab Cart Data...''

from itertools import product
from shop.models import Order, Product, Cart, CartItem, ProductSize
from users.serializers import User
from rest_framework import serializers


# Orders

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('cart', 'date_placed', 'user',  'street_address', 'zip_code', 'city',
        'state', 'first_name', 'last_name')

    def create(self, validated_data):
        order = Order.objects.create_order(
            cart            = validated_data['cart'],
            date_placed     = validated_data['date_placed'],
            user            = validated_data['user'],
            street_address  = validated_data['street_address'],
            zip_code        = validated_data['zip_code'],
            city            = validated_data['city'],
            state           = validated_data['state'],
            first_name      = validated_data['first_name'],
            last_name       = validated_data['last_name'],
        )

        return order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('cart', 'date_placed', 'user',  'street_address', 'zip_code', 'city',
        'state', 'first_name', 'last_name')


# Products

class ProductSerializer(serializers.ModelSerializer):
    #sizes = ProductSize.objects.filter(product = product)
    class Meta:
        model = Product
        fields = ('id', 'title', 'description', 'image_preview', 'date_added', 'base_cost', 'available')

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ('product_id', 'size', 'added_cost')


#class ProductSize(models.Model):
#    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
#    size            = models.CharField(max_length = 50, null = False, blank = False, default = 'M')
#    added_cost      = models.FloatField(default = 0)


# Cart

# Serializer is used for both creation and retrieval of an object such as this.
class CartSerializer(serializers.ModelSerializer):

    cart_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('checked_out', 'cart_items')

    def get_cart_items(self, obj):
        cart_items = CartItem.objects.filter(cart=obj)
        return CartItemSerializer(cart_items, many=True).data
    
    

class CreateCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('checked_out', 'cart_item', 'my_user')
    
    def create(self, validated_data):
        cart = Cart.objects.create_cart(
            checked_out     = validated_data['checked_out'],
            cart_item       = validated_data['cart_item'],
            my_user         = validated_data['my_user'],
        )

        return cart


# Cart Item

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ('product', 'adjusted_total', 'size', 'quantity')


class CreateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ('cart', 'product', 'adjusted_total', 'color', 'size', 'quantity', 'my_user')
    
    def create(self, validated_data):
        cart_item = CartItem.objects.create_cart_item(
            cart            = validated_data['cart'],
            product         = validated_data['product'],
            adjusted_total  = validated_data['adjusted_total'],
            size            = validated_data['size'],
            quantity        = validated_data['quantity'],
            my_user         = validated_data['my_user']
        )

        return cart_item