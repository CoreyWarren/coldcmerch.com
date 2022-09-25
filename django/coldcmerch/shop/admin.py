from django.contrib import admin
from .models import Product, Order, ProductColor, ProductImage, ProductSize, Cart, CartItem

# Register your models here.


# For displaying Products:
class SizeInLine(admin.StackedInline):
    model = ProductSize
    extra = 0

class ColorInLine(admin.StackedInline):
    model = ProductColor
    extra = 0

class ImageInLine(admin.StackedInline):
    model = ProductImage
    extra = 0

class ProductAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['title', 'description', 'image_preview', 'base_cost', 'available']}),
    ]
    inlines = [SizeInLine, ColorInLine, ImageInLine]

admin.site.register(Product, ProductAdmin)



# For displaying Carts:
class CartItemInline(admin.StackedInline):
    model = CartItem
    extra = 0
    readonly_fields = ['cart', 'product', 'adjusted_total', 'color', 'size', 'quantity']

class CartItemAdmin(admin.ModelAdmin):
    readonly_fields = ['cart', 'product', 'adjusted_total', 'color', 'size', 'quantity']


# We don't need to edit Cart Items, or even to necessarily view them outside of placed Orders.
admin.site.register(CartItem, CartItemAdmin)


class CartAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['final_total', 'checked_out', 'my_user']}),
    ]
    
    inlines = [CartItemInline]
    readonly_fields = ['checked_out', 'final_total']

admin.site.register(Cart, CartAdmin)


class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ['cart', 'user', 'date_placed', 'street_address', 'first_name', 'last_name', 'zip_code', 'city', 'state']

admin.site.register(Order, OrderAdmin)


# The rest:

listOfModels = []
for x in listOfModels:
    admin.site.register(x)