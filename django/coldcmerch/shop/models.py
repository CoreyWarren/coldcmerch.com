from django.db import models
from django.utils.translation import gettext_lazy as _

#
# Items for Sale:
#

class Product(models.Model):
    title           = models.CharField(max_length = 50, null = False, blank = False)
    description     = models.TextField(max_length = 1000, null = False, blank = False)
    image_preview   = models.ImageField(upload_to='images/products/', null = False, blank = False)
    date_added      = models.DateTimeField(auto_now_add=True, blank = True)
    
    images          = models.ForeignKey('ProductImage', related_name="product_images", null = True, blank = True, on_delete=models.CASCADE)
    sizes           = models.ForeignKey('ProductSize', related_name="product_sizes", null = True, blank = True, on_delete=models.CASCADE)
    colors          = models.ForeignKey('ProductColor', related_name="product_colors", null = True, blank = True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.title) + ' --- ' + str(self.date_added)


class ProductImage(models.Model):
    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    image_full      = models.ImageField(upload_to='images/products/', null = False, blank = False)

    def __str__(self):
        return str(self.product) + ' --- ' + 'image' + self.id


class ProductSize(models.Model):
    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    size            = models.CharField(max_length = 50, null = False, blank = False)

    def __str__(self):
        return str(self.product) + ' --- ' + str(self.size) + str(self.id)

class ProductColor(models.Model):
    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    color           = models.CharField(max_length = 50, null = False, blank = False)

    def __str__(self):
        return str(self.product) + ' --- ' + str(self.color) + str(self.id)

#
# Shopping Cart:
#

class Cart(models.Model):
    checked_out = models.BooleanField(default=False, verbose_name=('checked out'))
    cartitem            = models.ForeignKey('CartItem', verbose_name=_('cartitem'), on_delete=models.CASCADE)

    class Meta:
        verbose_name = _('cart')
        verbose_name_plural = _('carts')

class CartItem(models.Model):
    product             = models.ForeignKey(Product, verbose_name=_('product'), on_delete=models.CASCADE)
    quantity            = models.IntegerField(default=1, null = False, blank = False)


#
# Orders: 
#

class Order(models.Model):
    cart_item       = models.ForeignKey(CartItem, null = False, blank = False, on_delete=models.CASCADE)
    date_placed     = models.DateTimeField()


