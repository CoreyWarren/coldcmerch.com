from django.test import TestCase
from rest_framework.test import APIClient
from shop.models import Cart, Product, ProductSize, CartItem
from users.models import UserAccount
from django.urls import reverse



class ShopAPITestCase(TestCase):

    

    def setUp(self):
        self.client = APIClient()

        # Register Test user and Login
        UserAccount.objects.create_user(
            first_name="testuser",
            last_name= "lastname",
            email="minecraft@microsoft.com",
            password="testpassword%86"
        )



        response = self.client.post(
            reverse('token_obtain_pair'),
            {
            'email': 'minecraft@microsoft.com',
            'password':'testpassword%86'
            },
            format='json'
            )
        
        response.data['access'] = 'Bearer ' + response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=response.data['access'])


        self.user = UserAccount.objects.get(email="minecraft@microsoft.com")


    
    def test_create_product(self):
        print("\n\n==================================")
        print("Creating Product...")
        print("==================================")
        Product.objects.create(
            title='Test Product', description= '...', base_cost=10.0
        )
        assert Product.objects.count() == 1

    def test_create_product_size(self):
        print("Creating Product Size...")
        ProductSize.objects.create(
            product_id=Product.objects.first(), size='S', added_cost=2.0
        )
        assert ProductSize.objects.count() == 1

    def test_create_cart(self):
        print("\n\n==================================")
        print("Creating Cart...")
        print("==================================")
        Cart.objects.create(
            my_user=self.user, checked_out=False
        )
        assert Cart.objects.count() == 1


    def test_create_cart_view(self):
        print("\n\n==================================")
        print("Creating Cart using a View...")
        print("==================================")
        data = {
            "checked_out": False,
            "cart_item": 1,
            "my_user": self.user.id
        }
        response = self.client.post(reverse('create_cart'), data)
        print("Data received:", response.data)
        print("Success: ", response.data)



    def test_retrieve_cart_view(self):
        print("\n\n==================================")
        print("Retrieving Cart using a View...")
        print("==================================")
        response = self.client.get(reverse('get_cart'))

        print("Data received:", response.data)
        self.assertEqual(response.status_code, 200)
        print("Success: ", response.data)




    def test_create_cart_item_view(self):
        print("\n\n==================================")
        print("Creating Cart Item using a view...")
        print("==================================")
        Cart.objects.create(
            my_user=self.user, checked_out=False
        )

        Product.objects.create(
            title='Test Product', description= '...', base_cost=10.0
        )

        ProductSize.objects.create(
            product_id=Product.objects.first(), size='S', added_cost=2.0
        )



        response = self.client.post(reverse('create_cart_item'), {
            'cart': Cart.objects.first().id,
            'product': Product.objects.first().id,
            'size': "S",
            'quantity': 2
        }, format='json')

        print("Data received:", response.data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(CartItem.objects.filter(cart=Cart.objects.first().id, product=Product.objects.first().id).exists())
        print("Success: ", response.data)


    def test_remove_cart_item_view(self):
        print("\n\n==================================")
        print("Removing Cart Item using a view...")
        print("==================================")
        Cart.objects.create(
            my_user=self.user, checked_out=False
        )

        Product.objects.create(
            title='Test Product', description= '...', base_cost=10.0
        )

        ProductSize.objects.create(
            product_id=Product.objects.first(), size='S', added_cost=2.0
        )


        response = self.client.post(reverse('create_cart_item'), {
            'cart': Cart.objects.first().id,
            'product': Product.objects.first().id,
            'size': "S",
            'quantity': 2
            }, format='json'
            )

        # Create the Cart Item first (This is separated from the other test because
        # we want to isolate the delete test to only the remove_cart_item view)
        print("Data received:", response.data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(CartItem.objects.filter(cart=Cart.objects.first().id, product=Product.objects.first().id).exists())
        print("Success: ", response.data)

        # Then delete it
        response = self.client.post(reverse('remove_cart_item'), {'cart_item_id': CartItem.objects.first().id}, format='json')
        print("Data received:", response.data)
        self.assertFalse(CartItem.objects.exists())
        print("Success: ", response.data)


    # This runs automatically when testing is complete.
    def tearDown(self):
        UserAccount.objects.all().delete()
        Cart.objects.all().delete()
        Product.objects.all().delete()
        ProductSize.objects.all().delete()
        print("Tear down complete")

    # Add more test methods for other API views

# Create your tests here.
