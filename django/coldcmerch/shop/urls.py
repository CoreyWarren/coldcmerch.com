from django.urls import path
from .views import *
# shop/urls.py

urlpatterns = [

    # PRODUCTS:
    # api/shop/product
    path('product', RetrieveSingleProductView.as_view()),

    # api/shop/product/size
    path('product/size', RetrieveProductSizeView.as_view()),

    # api/shop/product/all
    path('product/all', RetrieveAllProductView.as_view()),

    # ORDERS:
    # api/shop/order
    path('order', RetrieveOrderView.as_view()),

    # api/shop/order/post
    path('order/post', CreateOrderView.as_view()),

    # CARTS:
    # api/shop/cart
    path('cart', RetrieveCartView.as_view()), 

    # api/shop/cart/post
    path('cart/post', CreateCartView.as_view()), 

    # CART ITEMS:
    # api/shop/cart_item
    path('cart_item', RetrieveCartItemsView.as_view()), 

    # api/shop/cart_item/post
    path('cart_item/post', CreateCartItemView.as_view()), 


]