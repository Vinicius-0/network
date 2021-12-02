# Generated by Django 3.2.9 on 2021-12-02 21:08

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0010_auto_20211202_1400'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='followers',
            field=models.ManyToManyField(related_name='followedProfiles', to=settings.AUTH_USER_MODEL),
        ),
    ]
