"""
URL mappings for the user API
"""
from django.urls import path

from user.views import UserCreateView, TokenView, ManageUserView


app_name = 'user'
urlpatterns = [
    path('create/', UserCreateView.as_view(), name='create'),
    path('token/', TokenView.as_view(), name='token'),
    path('me/', ManageUserView.as_view(), name='me'),
]
