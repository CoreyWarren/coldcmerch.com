"""coldcmerch URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

# Token API setup
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

# Media and Static files support
from django.conf import settings
from django.views.static import serve

# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html

# Urls below:

urlpatterns = [
    # Admin URL:
    path('admin', admin.site.urls),


    # User authentication API endpoints:
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/verify', TokenVerifyView.as_view(), name='token_verify'),


    # Django apps API endpoints (INCLUDE):
    path('api/users', include('users.urls')),
    path('api/shop', include('shop.urls')),
    path('api/stripe', include('stripePayments.urls')),


    # Models images, and other static/media files:
	re_path(r'^media/(?P<path>.*)$', serve, {'document_root' : settings.MEDIA_ROOT}),
	re_path(r'^static/(?P<path>.*)$', serve, {'document_root' : settings.STATIC_ROOT}),


]
