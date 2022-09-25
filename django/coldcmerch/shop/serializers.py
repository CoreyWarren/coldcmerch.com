# shop/serializers.py

# The specific functions of this serializer are to:
#
# > Grab Product Data from the Django backend and push it to the React frontend
# > Grab Order Data...''
# > Grab Cart Data...''

from itertools import product
from shop.models import Order, Product, Cart, CartItem
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
    class Meta:
        model = Product
        fields = ('title', 'description', 'image_preview', 'date_added', 'base_cost', 'available', 'images', 'sizes', 'colors')

# Cart

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('checked_out', 'cart_item', 'final_total', 'my_user')

class CreateCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('checked_out', 'cart_item', 'final_total', 'my_user')
    
    def create(self, validated_data):
        cart = Cart.objects.create_cart(
            checked_out     = validated_data['checked_out'],
            cart_item       = validated_data['cart_item'],
            final_total     = validated_data['final_total'],
            my_user         = validated_data['my_user'],
        )

        return cart


# Cart Item

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ('cart', 'product', 'adjusted_total', 'color', 'size', 'quantity')


class CreateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ('cart', 'product', 'adjusted_total', 'color', 'size', 'quantity')
    
    def create(self, validated_data):
        cart_item = CartItem.objects.create_cart_item(
            cart            = validated_data['cart'],
            product         = validated_data['product'],
            adjusted_total  = validated_data['adjusted_total'],
            color           = validated_data['color'],
            size            = validated_data['size'],
            quantity        = validated_data['quantity'],
        )

        return cart_item