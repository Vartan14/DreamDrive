"""
URL mappings for the user API
"""
from django.urls import path

from user.views import UserCreateView, ManageUserView, UserListView
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView


app_name = 'user'
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('create/', UserCreateView.as_view(), name='create'),
    path('me/', ManageUserView.as_view(), name='me'),
    path('list/', UserListView.as_view(), name='list'),
]
