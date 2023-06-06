from django.urls import path
from .views import StripeCreatePaymentIntentView, StripeListAllActiveProductsView, order_confirmation_webhook

urlpatterns = [
    # api/stripe/create-payment-intent
    path('create-payment-intent', StripeCreatePaymentIntentView.as_view()),
    # api/stripe/list-all-active-products
    path('list-all-active-products', StripeListAllActiveProductsView.as_view()),
    # api/stripe/order_confirmation_webhook
    path('order_confirmation_webhook', order_confirmation_webhook, name='order_confirmation_webhook'),
]
