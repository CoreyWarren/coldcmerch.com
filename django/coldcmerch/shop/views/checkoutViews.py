from django.shortcuts import render
from shop.models import Product
from shop.models import Cart, CartItem, ProductSize
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response

# CHECKOUT VIEWS

#
# CHECKOUT
#

