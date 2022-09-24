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