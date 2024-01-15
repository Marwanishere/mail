from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
import json

from .models import User
from .models import Tweet


def index(request):
    # edit to code made using the help of cs50 chatbot
    old_posts = Tweet.objects.all().order_by("-timestamp")
    return render(request, "network/index.html", {'old_posts': old_posts})


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

def npost(request):
    if request.method != "GET":
        dataPool = json.loads(request.body)
        new_post = Tweet.objects.create(
            user=request.user,
            content=dataPool['content'],
            title=dataPool["title"]
        )
        return JsonResponse({'message': 'Post generated successfully.'}, status=201)
    # above line acquired through cs50 chatbot prompting
    return HttpResponseRedirect(reverse("index"))

def delete_post(request, post_id):
    post_id = json.loads(request.body)['id']
    user = request.user
    old_posts = Tweet.objects.get(id = post_id)
    if user == old_posts.user or user.is_superuser:
        old_posts.delete()
    remaining_posts = Tweet.objects.all()
    return render(request, "network/index.html", {'remaining_posts': remaining_posts})

def smprofile(request, username):
    selected_users_old_posts = Tweet.objects.filter(user__username=username).order_by("-timestamp")
    # as 'user' is a foreign key to the User model, you should be able to access the username with user__username
    return render(request, "network/smprofile.html", {"selected_users_old_posts": selected_users_old_posts, "username": username})

def followstatus(request, username):
    if request.method == "PUT":
        data = json.loads(request.body)
        followstatus = data['followstatus']
        # above 2 lines acquired through cs50.ai prompting

        # to get the user i used the following technique i learned
        userFollowed = User.objects.get(username=username)
        if followstatus == 'Follow':
            request.user.Following_M2M.add(userFollowed)
        elif followstatus == 'Unfollow':
            request.user.Following_M2M.remove(userFollowed)

    return JsonResponse({'followstatus': followstatus})
    