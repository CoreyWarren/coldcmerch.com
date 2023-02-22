# Generated by Django 4.0.3 on 2022-09-24 03:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_productcolor_product_productimage_product_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='cart_item',
        ),
        migrations.AddField(
            model_name='cart',
            name='final_total',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='adjusted_total',
            field=models.FloatField(default=30),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='cart',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='my_cart', to='shop.cart'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='color',
            field=models.CharField(default='None specified.', max_length=50),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='size',
            field=models.CharField(default='None specified.', max_length=50),
        ),
        migrations.AddField(
            model_name='order',
            name='cart',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shop.cart'),
        ),
        migrations.AddField(
            model_name='product',
            name='available',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='product',
            name='base_cost',
            field=models.FloatField(default=25),
        ),
        migrations.AddField(
            model_name='productcolor',
            name='added_cost',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='productsize',
            name='added_cost',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='cart',
            name='cartitem',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='my_item', to='shop.cartitem'),
        ),
        migrations.AlterField(
            model_name='order',
            name='date_placed',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='productcolor',
            name='color',
            field=models.CharField(default='Default', max_length=50),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='image_full',
            field=models.ImageField(default='images/products/1.png', upload_to='images/products/'),
        ),
        migrations.AlterField(
            model_name='productsize',
            name='size',
            field=models.CharField(default='M', max_length=50),
        ),
    ]
