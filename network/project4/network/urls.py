
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("npost", views.npost , name = "npost"),
    path("delete_post/<int:post_id>/", views.delete_post , name = "delete_post"),
    path("smprofile/<str:username>/", views.smprofile , name = "smprofile"),
    path("followstatus/<str:username>/", views.followstatus, name = "followstatus")
    # smprofile stands for social media profile

]
