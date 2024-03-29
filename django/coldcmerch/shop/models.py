from tabnanny import check
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
    base_cost       = models.FloatField(default = 25, null = False, blank = False)
    available       = models.BooleanField(default = True)

    def __str__(self):
        return str(self.id) + ' ' + str(self.title) + ' --- ' + str(self.date_added)


class ProductImage(models.Model):
    product         = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    image_full      = models.ImageField(upload_to='images/products/', null = False, blank = False, default = 'images/products/1.png')

    def __str__(self):
        return str(self.product) + ' --- ' + 'image' + self.id


class ProductSize(models.Model):
    # "cascade" here allows us to make changes to the Product model and keep this column in sync with that foreign key.
    product_id          = models.ForeignKey('Product', on_delete=models.CASCADE, null = True)
    size                = models.CharField(max_length = 50, null = False, blank = False, default = 'M')
    added_cost          = models.FloatField(default = 0)
    available_amount    = models.IntegerField(default = 1)

    def __str__(self):
        return str(self.size) + ' for product #' + str(self.product_id)

#
# Shopping Cart:
#

class CartManager(models.Manager):
    # Orders are basically checked-out carts that are ready
    # to be shipped by us. That's why it has all this info.
    def create_cart(self, checked_out, cart_item, my_user):

        cart = self.model(
            checked_out     = checked_out,
            cart_item       = cart_item,
            my_user         = my_user,
        )
        cart.save(using=self._db)
        return cart
    
    def has_active_cart(self, user):
        return self.filter(my_user=user, checked_out=False).exists()


# The logic behind the cart model is as follows:
#   - A user has only one active Cart at a time
#   - When a cart is purchased by the user, it is dispatched to an Order.
#   - Every Order object is assigned one Cart.
#   - When a cart is purchased, it is deactivated, and the user starts a new one.

class Cart(models.Model):
    checked_out         = models.BooleanField(default=False, verbose_name=('checked out'))
    cart_item           = models.ForeignKey('CartItem', related_name="my_item", on_delete=models.CASCADE, null = True, blank = True, default = None)
    my_user             = models.ForeignKey('users.UserAccount', on_delete=models.CASCADE, null = False, blank = False, default=1)

    # Assign a manager for POST operations for the serializer/API/creation
    #   of new Carts.
    objects = CartManager()

    def __str__(self):
        myStatus = ""
        if(self.checked_out):
            myStatus = "Checked Out"
        else:
            myStatus = "Pending"
        
        return str(self.id) + ', ' + myStatus + ', for ' + str(self.my_user)
    






# Cart Items:

class CartItemManager(models.Manager):
    # Orders are basically checked-out carts that are ready
    # to be shipped by us. That's why it has all this info.
    def create_cart_item(self, cart, product, adjusted_total, size, quantity, my_user):

        cart_item = self.model(
            cart = cart,
            product = product,
            adjusted_total = adjusted_total,
            size = size,
            quantity = quantity,
            my_user = my_user,
        )
        cart_item.save(using=self._db)
        return cart_item



class CartItem(models.Model):
    cart                = models.ForeignKey('Cart', related_name="cart_items", on_delete=models.CASCADE, null = True, blank = True, default=None)
    product             = models.ForeignKey('Product', verbose_name=_('product'), on_delete=models.CASCADE)
    adjusted_total      = models.FloatField(default = 0, null = False, blank = False)
    size                = models.CharField(max_length = 50, null = False, blank = False, default = "None specified.")
    quantity            = models.IntegerField(default = 1, null = False, blank = False)
    my_user             = models.ForeignKey('users.UserAccount', on_delete=models.CASCADE, null = False, blank = False, default=1)

    objects = CartItemManager()

    def __str__(self):
        return str(self.id) \
        + ', ' + str(self.product.title) \
        + ', Size: ' + str(self.size) \
        + ', for ' + str(self.adjusted_total) + ' USD.'
        + ', for ' + str(self.my_user) + '.'




