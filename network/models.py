from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    def __str__(self):
        return f"{self.username} - {self.id}"
    pass


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name='followedProfiles')

    def serialize(self, user):
        return {
            'id': self.id,
            'username': self.user.username,
            'followers': self.followers.count(),
            'following': self.user.followedProfiles.count(),
            'isFollowing': not user.is_anonymous and self in user.followedProfiles.all(),
            'canFollow': not user.is_anonymous and self.user != user
        }

    def __str__(self):
        return f"{self.user.username} - (id = {self.id})"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Post(models.Model):
    creator = models.ForeignKey(Profile, on_delete=models.CASCADE)
    likes = models.ManyToManyField(
        Profile, blank=True, related_name='allLikedPosts')
    content = models.CharField(max_length=280, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self, user):
        return {
            'id': self.id,
            'creator': self.creator.user.username,
            'creatorID': self.creator.id,
            'likes': self.likes.count(),
            'liked': not user.is_anonymous and self in Profile.objects.get(user=user).allLikedPosts.all(),
            'content': self.content,
            'timestamp': self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self):
        return f"{self.creator.user.username} - {self.content}"
