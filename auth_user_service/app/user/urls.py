"""
URL mappings for the user API
"""
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView, TokenVerifyView

from user.views import UserCreateView, ManageUserView
from user.router import urlpatterns as user_admin_urls


app_name = 'user'
urlpatterns = [
    # Authentication URLs
    #path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    #path('register/', UserCreateView.as_view(), name='register'),
    #path('logout/', LogoutView.as_view(), name='logout'),
    #path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    path('me/', ManageUserView.as_view(), name='me'),


    # Include the user admin URLs
    path('', include(user_admin_urls))
]
