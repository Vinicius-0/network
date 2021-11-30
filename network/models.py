from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Profile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='posts')
    followers = models.ManyToManyField(User, related_name='followers')
    following = models.ManyToManyField(User, related_name='following')


class Post(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, blank=True, related_name='likes')
    content = models.CharField(max_length=280, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
