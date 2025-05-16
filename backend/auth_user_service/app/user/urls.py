"""
URL mappings for the user API
"""
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView, TokenVerifyView
from user.views import UserCreateView, ManageUserView

from rest_framework.routers import DefaultRouter
from user.views import UserAdminViewSet

router = DefaultRouter()
router.register(r'', UserAdminViewSet, basename='admin-users')


app_name = 'users'
urlpatterns = [
    # Authentication URLs
    #path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    #path('register/', UserCreateView.as_view(), name='register'),
    #path('logout/', LogoutView.as_view(), name='logout'),
    #path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # User management URLs
    path('me/', ManageUserView.as_view(), name='me'),

    # Admin CRUD URLs for users
    path('', include(router.urls))
]
