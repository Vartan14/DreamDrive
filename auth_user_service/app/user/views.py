"""
Views for the User API
"""
from rest_framework import generics, authentication, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings

from user.serializers import UserSerializer, TokenSerializer


class UserCreateView(generics.CreateAPIView):
    """View to create a new user in the system."""
    serializer_class = UserSerializer
    permission_classes = []


class TokenView(ObtainAuthToken):
    """
    View to create a new auth token for the user.
    """
    serializer_class = TokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class ManageUserView(generics.RetrieveUpdateAPIView):
    """View to manage the authenticated user."""
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Retrieve and return the authenticated user."""
        return self.request.user
