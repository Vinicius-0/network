# Generated by Django 3.2.9 on 2021-12-14 19:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0011_alter_profile_followers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='allLikedPosts', to='network.Profile'),
        ),
    ]