from django.urls import path
from .views import (
    RegisterView,
    UserProfileView,
    ChangePasswordView,
    ProfilePictureView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile-picture/', ProfilePictureView.as_view(), name='profile-picture'),
]
