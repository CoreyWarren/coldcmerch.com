from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import UserAccount

#
# Items for Sale:
#

class Product(models.Model):
    title           = models.CharField(max_length = 50, null = False, blank = False)
    description     = models.TextField(max_length = 1000, null = False, blank = False)
    image_preview   = models.ImageField(upload_to='images/products/', null = False, blank = False)
    date_added      = models.DateTimeField(auto_now_add=True, blank = True)
    base_cost       = models.FloatField(default = 25, null = False, blank = False)
    available       = models.BooleanField(default = True)
    
    images          = models.ForeignKey('ProductImage', related_name="product_images", null = True, blank = True, on_delete=models.CASCADE)
    sizes           = models.ForeignKey('ProductSize', related_name="product_sizes", null = True, blank = True, on_delete=models.CASCADE)
    colors          = models.ForeignKey('ProductColor', related_name="product_colors", null = True, blank = True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.title) + ' --- ' + str(self.date_added)


class ProductImage(models.Model):
    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    image_full      = models.ImageField(upload_to='images/products/', null = False, blank = False, default = 'images/products/1.png')

    def __str__(self):
        return str(self.product) + ' --- ' + 'image' + self.id


class ProductSize(models.Model):
    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    size            = models.CharField(max_length = 50, null = False, blank = False, default = 'M')
    added_cost      = models.FloatField(default = 0)

    def __str__(self):
        return str(self.id) + ', ' + str(self.product) + ' --- ' + str(self.size)

class ProductColor(models.Model):
    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    color           = models.CharField(max_length = 50, null = False, blank = False, default = 'Default')
    added_cost      = models.FloatField(default = 0)

    def __str__(self):
        return str(self.product) + ' --- ' + str(self.color) + str(self.id)

#
# Shopping Cart:
#

class Cart(models.Model):
    checked_out         = models.BooleanField(default=False, verbose_name=('checked out'))
    cartitem            = models.ForeignKey('CartItem', related_name="my_item", on_delete=models.CASCADE, null = True, blank = True, default = None)
    final_total         = models.FloatField(default = 0, blank = False, null = False)

    def __str__(self):
        myStatus = ""
        if(self.checked_out):
            myStatus = "Checked Out"
        else:
            myStatus = "Pending"
        
        return str(self.id) + ', ' + myStatus + ' for ' + str(self.final_total) + ' USD.'


    class Meta:
        verbose_name = _('cart')
        verbose_name_plural = _('carts')

class CartItem(models.Model):
    cart                = models.ForeignKey('Cart', related_name="my_cart", on_delete=models.CASCADE, null = True, blank = True, default=None)
    product             = models.ForeignKey('Product', verbose_name=_('product'), on_delete=models.CASCADE)
    adjusted_total      = models.FloatField(default = 30, null = False, blank = False)
    color               = models.CharField(max_length = 50, null = False, blank = False, default = "None specified.")
    size                = models.CharField(max_length = 50, null = False, blank = False, default = "None specified.")
    quantity            = models.IntegerField(default = 1, null = False, blank = False)

    def __str__(self):
        return str(self.id) \
        + ', ' + str(self.product.title) \
        + ', Color: ' + str(self.color) \
        + ', Size: ' + str(self.size) \
        + ', for ' + str(self.adjusted_total) + ' USD.'

#
# Orders: 
#

class Order(models.Model):
    cart            = models.ForeignKey(Cart, null = True, blank = False, on_delete=models.CASCADE)
    date_placed     = models.DateTimeField(auto_now_add=True)
    user            = models.ForeignKey(UserAccount, null = True, blank = False, on_delete=models.CASCADE)
    street_address  = models.CharField(max_length= 300, default="No Address given...")
    first_name      = models.CharField(max_length= 100, default ='None...' )
    last_name       = models.CharField(max_length= 100, default ='None...')


    def __str__(self):
        return 'Order ' + str(self.id) + ' filled: ' + str(self.date_placed)
