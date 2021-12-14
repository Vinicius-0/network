
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newPost", views.newPost, name="newPost"),
    path("profile/<int:userID>", views.profile, name="profile"),
    path("handleFollow", views.handleFollow, name="handleFollow"),
    path("handleLike", views.handleLike, name="handleLike"),
    path("load/<str:page>", views.loadPosts, name="load"),
]
