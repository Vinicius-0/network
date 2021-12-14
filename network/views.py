import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import User, Post, Profile


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def newPost(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get("content", "")
        post = Post()
        post.creator = Profile.objects.get(user=request.user)
        post.content = content
        post.save()

    return HttpResponseRedirect(reverse("index"))


def profile(request, userID):
    profile = Profile.objects.get(id=userID)
    posts = Post.objects.order_by('-timestamp').filter(creator=userID)
    return JsonResponse({
        'posts': [item.serialize() for item in posts],
        'profile': profile.serialize(request.user),
        'isFollowing': profile in request.user.followedProfiles.all(),
    }, safe=False)


def loadPosts(request, page):
    if page == 'allPosts':
        posts = Post.objects.order_by('-timestamp').all()
    elif page == 'following':
        return loadFollowingPosts(request)
    return JsonResponse({'posts': [post.serialize() for post in posts]}, safe=False)


@login_required
def loadFollowingPosts(request):
    following = request.user.followedProfiles.all()
    posts = Post.objects.order_by(
        '-timestamp').filter(creator__in=following).all()
    return JsonResponse({'posts': [post.serialize() for post in posts]}, safe=False)


@csrf_exempt
@login_required
def handleFollow(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        profile = Profile.objects.get(id=data.get('profileID'))
        if profile in request.user.followedProfiles.all():
            actualState = 'Follow'
            profile.followers.remove(request.user)
        else:
            actualState = 'Unfollow'
            profile.followers.add(request.user)
        profile.save()
    return JsonResponse({'followers': profile.followers.count(), 'actualState': actualState}, status=200)


@csrf_exempt
@login_required
def handleLike(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        # profile = Profile.objects.filter(user=request.user)
        # post = Post.objects.get
        # if profile in request.user.followedProfiles.all():
        #     actualState = 'Follow'
        #     profile.followers.remove(request.user)
        # else:
        #     actualState = 'Unfollow'
        #     profile.followers.add(request.user)
        # profile.save()
    return JsonResponse({'post': data, 'profile': 'profile'}, status=200)


def pagination(posts):
    paginator = Paginator(posts, 1)
