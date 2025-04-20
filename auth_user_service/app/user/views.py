"""
Views for the User API
"""
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework import generics, viewsets, views, permissions
from rest_framework.response import Response

from rest_framework_simplejwt import authentication
from rest_framework_simplejwt import tokens as jwt_tokens

from user.serializers import UserSerializer, LogoutSerializer, ChangePasswordSerializer


class UserCreateView(generics.CreateAPIView):
    """View to create a new user in the system."""
    serializer_class = UserSerializer
    permission_classes = []


class ManageUserView(generics.RetrieveUpdateAPIView):
    """View to manage the authenticated user."""
    serializer_class = UserSerializer
    authentication_classes = [authentication.JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Retrieve and return the authenticated user."""
        return self.request.user


class LogoutView(views.APIView):
    """View to log out the user by blacklisting the refresh token."""
    authentication_classes = [authentication.JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request):
        """Get refresh token from request and blacklist it."""
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = jwt_tokens.RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except jwt_tokens.TokenError as e:
            return Response(
                {"detail": f"Invalid or expired token. Error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class ChangePasswordView(generics.UpdateAPIView):
    """View for authenticated users to change their password."""
    serializer_class = ChangePasswordSerializer
    authentication_classes = [authentication.JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']

    def get_object(self):
        """Returns the currently authenticated user."""
        return self.request.user

    def update(self, request, *args, **kwargs):
        """Handles the password change logic.
        Validates the input and saves the new password if valid."""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)


class UserAdminViewSet(viewsets.ModelViewSet):
    """ViewSet for managing users, accessible only to admins."""
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
