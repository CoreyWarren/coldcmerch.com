"""
Django settings for coldcmerch project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import os

# I want to import environment variables from a .env file.
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env()

# These modes are used to determine which settings to use.
windows_test_mode       = False
linux_test_mode         = False
live_development_mode   = False
production_mode         = True

# SECURITY WARNING: don't run with debug turned on in production!
if windows_test_mode:
    DEBUG = True
    ALLOWED_HOSTS = ['coldcmerch.com', '*']
elif linux_test_mode:
    DEBUG = True
    ALLOWED_HOSTS = ['coldcmerch.com', '*']
elif live_development_mode:
    DEBUG = False
    ALLOWED_HOSTS = ['coldcmerch.com']
elif production_mode:
    DEBUG = False
    ALLOWED_HOSTS = ['137.184.114.49', 'coldcmerch.com', 'www.coldcmerch.com']



STRIPE_PRIVATE_KEY      = env('STRIPE_PRIVATE_KEY')
STRIPE_PUBLIC_KEY       = env('STRIPE_PUBLIC_KEY')
STRIPE_WEBHOOK_SECRET   = env('STRIPE_WEBHOOK_SECRET')
DJANGO_SECRET_KEY       = env('DJANGO_SECRET_KEY')
DATABASE_NAME           = env('DATABASE_NAME') 
DATABASE_USER           = env('DATABASE_USER')

if(live_development_mode or production_mode):
    DATABASE_USER_PASSWORD  = env('DATABASE_USER_PASSWORD')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

SITE_URL = 'coldcmerch.com'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = DJANGO_SECRET_KEY







# Application definition

INSTALLED_APPS = [
    # base:

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # custom/added:

    'rest_framework', # rest api
    'rest_framework.authtoken', # token authentication
    'users', #custom user authentication django app
    'shop', # e-commerce backend django app
    'stripePayments', # stripe payments as a django app
    'corsheaders', # django cors headers middleware required app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'coldcmerch.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'coldcmerch.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

if(live_development_mode or production_mode):
    DATABASES = {

        'default': {

            'ENGINE': 'django.db.backends.mysql',
            'NAME': DATABASE_NAME,
            'USER': DATABASE_USER,
            'PASSWORD': DATABASE_USER_PASSWORD,
            'HOST': '127.0.0.1',

        'OPTIONS': {
            'read_default_file': '/etc/mysql/my.cnf',
        },
        },

        'test': {

            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',

        },

    }
else:
    DATABASES = {
        'default': {

            'ENGINE': 'django.db.backends.mysql',
            'NAME': DATABASE_NAME,
            'USER': DATABASE_USER,
            'HOST': '127.0.0.1',

        'OPTIONS': {
            'read_default_file': '/etc/mysql/my.cnf',
        },
        },

        'test': {

            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',

        },
    }



# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Tijuana'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework_simplejwt.authentication.JWTAuthentication', # This is the default (not good for HTTPONLY cookies)
        'users.authentication.CookieJWTAuthentication', # This is custom, suited for HTTPONLY cookies, in production.
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=240),
}

# Cannot be changed (after migrations) without destroying your entire project:
AUTH_USER_MODEL = 'users.UserAccount'


if (windows_test_mode or linux_test_mode):
    CORS_ALLOWED_ORIGINS = ['*']
else:
    # Cors for deployment?:
    CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:5000',
    'http://137.184.114.49',
    'http://137.184.114.49:5000',
    'https://coldcmerch.com:5000',
    'https://coldcmerch.com',
    'https://www.coldcmerch.com:5000',
    'https://www.coldcmerch.com',
    'www.coldcmerch.com',
    'coldcmerch.com',
    '.coldcmerch.com',
    # Add more origins as needed
    ]

CORS_ALLOW_CREDENTIALS = True

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

###
# DEBUGGING LOGS:
###

# [Debugging logs for advanced debugging in production.]
# This configuration will output all logs of level DEBUG 
#   and above to the console, which should be visible 
#   in our Gunicorn logs.

# /var/log/gunicorn/error.log

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}