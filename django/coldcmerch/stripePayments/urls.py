from django.urls import path
from .views import StripeCheckoutView, StripeCreateProductView, StripeListAllActiveProductsView

urlpatterns = [
    # api/stripe/create-checkout-session
    path('create-checkout-session', StripeCheckoutView.as_view()),
    # api/stripe/create-product
    path('create-product', StripeCreateProductView.as_view()),
    # api/stripe/list-all-active-products
    path('list-all-active-products', StripeListAllActiveProductsView.as_view()),
]
