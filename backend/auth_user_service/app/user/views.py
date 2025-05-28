"""
Views for the User API
"""
from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt import authentication
from drf_spectacular.utils import extend_schema

from user.serializers import UserSerializer, AdminUserSerializer
from user_profile.serializers import StudentProfileSerializer, TeacherProfileSerializer, UserWithProfileSerializer


class UserCreateView(generics.CreateAPIView):
    """View to create a new user in the system."""
    serializer_class = UserSerializer
    permission_classes = []


@extend_schema(tags=["User"])
class ManageUserView(generics.RetrieveUpdateAPIView):
    """View to manage the authenticated user."""
    serializer_class = UserSerializer
    authentication_classes = [authentication.JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Retrieve and return the authenticated user."""
        return self.request.user


    def get(self, request):
        serializer = UserWithProfileSerializer(request.user)
        return Response(serializer.data)


@extend_schema(tags=["User"])
class UserAdminViewSet(viewsets.ModelViewSet):
    """ViewSet for managing users, accessible only to admins."""
    queryset = get_user_model().objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
