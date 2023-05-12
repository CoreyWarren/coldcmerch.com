from django.urls import path
from .views import *
# shop/urls.py

urlpatterns = [

    # PRODUCTS:
    # api/shop/product
    path('product', RetrieveSingleProductView.as_view(), name='get_product'),

    # api/shop/product/size
    path('product/size', RetrieveProductSizeView.as_view(), name='get_product_size'),

    # api/shop/product/all
    path('product/all', RetrieveAllProductView.as_view(), name='get_all_products'),

    # api/shop/product/by_ids
    path('product/by_ids', RetrieveProductsUsingIDs.as_view(), name='get_products_using_ids'),

    # CARTS:
    # api/shop/cart
    path('cart', RetrieveCartView.as_view(), name='get_cart'), 

    # api/shop/cart/post
    path('cart/post', CreateCartView.as_view(), name='create_cart'), 

    # CART ITEMS:
    # api/shop/cart_items
    path('cart_items', RetrieveCartItemsView.as_view(), name='get_cart_items'), 

    # api/shop/cart_items/post
    path('cart_items/post', CreateCartItemView.as_view(), name='create_cart_item'),

    # api/shop/cart_items/delete
    path('cart_items/delete', DeleteCartItemView.as_view(), name='delete_cart_item'),


]