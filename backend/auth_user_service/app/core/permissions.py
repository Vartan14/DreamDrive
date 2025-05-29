"""
Custom permissions for the application.
"""

# from rest_framework import permissions
#
#
# class IsAdminRole(permissions.BasePermission):
#     """Allows access only to users with role 'admin'."""
#
#     def has_permission(self, request, view):
#         return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')


from rest_framework.permissions import BasePermission
from django.conf import settings


class IsPaymentMicroservice(BasePermission):

    def has_permission(self, request, view):
        api_key = request.headers.get('X-API-KEY')
        return api_key == settings.PAYMENT_API_KEY


