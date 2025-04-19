"""
Custom permissions for the application.
"""
from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Allows access only to users with role 'admin'."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')
