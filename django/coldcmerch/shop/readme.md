### How I plan on linking these models/this database to our React Frontend:

The logic for the models is as follows:

Each product has various sizes, colors, and images associated with it. The product itself is unaware of which attributes are linked to it. However, the attributes know which object they are related to/based on.

Therefore, when attempting to list all sizes, colors, or images of a product, you will refer to, and filter all sizes, colors, or images that "point to" the product in question.

Essentially, you will say

```
{% for article in Articles_rh_details.categories.categories_for_articles.all %}
```

except you'll be doing it in React, so it will be in Javascript and will be stated slightly differently, but the idea is the same. Ask not the product.attribute.color list, but rather the filter.colors.shirt25, and the filter.sizes.shirt25, and the filter.images.shirt25 and display those. Is it annoying? Yes. But I'm actually not convinced that there were too many other ways. 

Reason being is because viewing these things in admin.py would be particularly messy. How would you add a new product, and then choose which size that product is--if it has multiple sizes? That array of numbers just doesn't add up. You'd need multiple choices... wait.


## THIS IS WHY WE LOOK UP DOCUMENTATION:

https://docs.djangoproject.com/en/3.2/intro/tutorial07/

I had forgotten that the original/primary django tutorial explains this exact situation to us! So cool! IT WORKS PERFECTLY.

#

#

#



## Next problem: Filtering this stuff for React/end-user viewing. Can we use this?:

https://django-shop.readthedocs.io/en/latest/reference/filters.html

## Show multiple choices for superusers in admin.py for objects:

https://www.geeksforgeeks.org/how-to-use-django-field-choices/


## admin.py show uneditable fields (readonly_fields):

https://books.agiliq.com/projects/django-admin-cookbook/en/latest/uneditable_field.html

## Inline Items Readonly:

https://stackoverflow.com/questions/6727372/get-readonly-fields-in-a-tabularinline-class-in-django

## Serializers in Django (Django-Rest-Framework):

https://www.django-rest-framework.org/api-guide/serializers/

## POST? GET? what??

https://www.w3schools.com/tags/ref_httpmethods.asp

## Managers!

https://docs.djangoproject.com/en/4.0/topics/db/managers/

## Django database queries Documentation:

(tags: get, filter, first, queryset, exclude)

https://docs.djangoproject.com/en/4.1/topics/db/queries/

## Importing JSON in Django (import json):

(tags: json.loads, json parser, parse json, request.data)

https://www.w3schools.com/python/python_json.asp

## Django Permissions (Django Rest Framework):

(tags: apiview, views, permissions, only correct user can access their own data, get, @api_view, @permission_classes, rest_framework)

https://www.django-rest-framework.org/api-guide/permissions/

## Accessing your "RetrieveCartView" and such in API using Postman/etc as an Authenticated User:

> In Headers, your key should be "Authorization"

> In Value, your value should be "Bearer X", where X is your session/refresh token. Yes, you need the space there.

## Updating a model object (a 'record') with a single queryset in Django:

https://stackoverflow.com/questions/2712682/how-to-select-a-record-and-update-it-with-a-single-queryset-in-django

```py
MyModel.objects.filter(pk=some_value).update(field1='some value')
```

# Referencing another database object's ID in models.py:

https://stackoverflow.com/questions/61018027/django-how-to-get-foreign-key-id
