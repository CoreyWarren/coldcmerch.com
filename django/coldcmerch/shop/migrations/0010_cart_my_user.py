# Generated by Django 4.0.3 on 2022-09-25 01:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shop', '0009_rename_cartitem_cart_cart_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='my_user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]