# Generated by Django 4.1 on 2023-01-14 02:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0017_remove_product_color_remove_product_image_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='productsize',
            old_name='product',
            new_name='product_id',
        ),
    ]
