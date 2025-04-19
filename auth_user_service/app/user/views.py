"""
Views for the User API
"""
from rest_framework.generics import (
    CreateAPIView,
    RetrieveUpdateAPIView,
    ListAPIView
)
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from user.serializers import UserSerializer
from core.permissions import IsAdminRole


class UserCreateView(CreateAPIView):
    """View to create a new user in the system."""
    serializer_class = UserSerializer
    permission_classes = []


class ManageUserView(RetrieveUpdateAPIView):
    """View to manage the authenticated user."""
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Retrieve and return the authenticated user."""
        return self.request.user


class UserListView(ListAPIView):
    """View to list all users in the system."""
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        """Retrieve and return all users."""
        return self.request.user.__class__.objects.all()
