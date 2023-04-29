from django.contrib import admin
from .models import Product, Order, ProductImage, ProductSize, Cart, CartItem

# Register your models here.



# For displaying Products:
class SizeInLine(admin.StackedInline):
    model = ProductSize
    min_num = 1
    extra = 0


class ImageInLine(admin.StackedInline):
    model = ProductImage
    min_num = 1
    extra = 0

class ProductAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['title', 'description', 'image_preview', 'base_cost', 'available']}),
    ]
    inlines = [SizeInLine, ImageInLine]
    # /\
    # Staff controlling the site can add sizes to products.
    # However, these size properties are their own objects which refer back to the object.
    # Sizes and Images are not properties of a product--they are objects which specify their parent product themselves.

admin.site.register(Product, ProductAdmin)



# For displaying Carts:
class CartItemInline(admin.StackedInline):
    model = CartItem
    extra = 0
    # commented for development use only (delete comments in production):
    readonly_fields = ['my_user', 'cart', 'product', 'adjusted_total',  'size', 'quantity']

class CartItemAdmin(admin.ModelAdmin):
    # commented for development use only (delete comments in production):
    readonly_fields = ['my_user', 'cart', 'product', 'adjusted_total', 'size', 'quantity']
    pass


# We don't need to edit Cart Items, or even to necessarily view them outside of placed Orders.
admin.site.register(CartItem, CartItemAdmin)


class CartAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['checked_out', 'my_user']}),
    ]
    
    inlines = [CartItemInline]
    # commented for development use only (delete comments in production):
    readonly_fields = ['my_user', 'checked_out']

admin.site.register(Cart, CartAdmin)


class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ['cart', 'user', 'date_placed', 'street_address', 'first_name', 'last_name', 'zip_code', 'city', 'state']

admin.site.register(Order, OrderAdmin)


# The rest:

listOfModels = []
for x in listOfModels:
    admin.site.register(x)