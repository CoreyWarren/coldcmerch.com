# Generated by Django 4.1 on 2023-05-12 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0024_remove_order_first_name_remove_order_last_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cartitem',
            name='adjusted_total',
            field=models.FloatField(default=0),
        ),
        migrations.DeleteModel(
            name='Order',
        ),
    ]
