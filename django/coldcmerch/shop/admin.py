from django.contrib import admin
from .models import Product, Order, ProductColor, ProductImage, ProductSize

# Register your models here.



class SizeInLine(admin.StackedInline):
    model = ProductSize
    extra = 1

class ColorInLine(admin.StackedInline):
    model = ProductColor
    extra = 1

class ImageInLine(admin.StackedInline):
    model = ProductImage
    extra = 1



class ProductAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['title', 'description', 'image_preview']}),
    ]
    inlines = [SizeInLine, ColorInLine, ImageInLine]

admin.site.register(Product, ProductAdmin)

listOfModels = [Order, ProductSize]
for x in listOfModels:
    admin.site.register(x)