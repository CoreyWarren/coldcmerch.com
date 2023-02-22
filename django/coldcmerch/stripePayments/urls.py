from django.urls import path
from .views import StripeCreatePaymentIntentView, StripeListAllActiveProductsView

urlpatterns = [
    # api/stripe/create-payment-intent
    path('create-payment-intent', StripeCreatePaymentIntentView.as_view()),
    # api/stripe/list-all-active-products
    path('list-all-active-products', StripeListAllActiveProductsView.as_view()),
]
