from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied


class RolePermission(BasePermission):
    """
    Permission class that allows access only to users with required roles.
    Usage:
        permission_classes = [RolePermission.allow_roles('admin', 'teacher')]
    """

    allowed_roles = []

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Extract role from token payload
        role = getattr(user, 'role', None) or request.auth.get('role')

        if role not in self.allowed_roles:
            raise PermissionDenied(detail=f"Access restricted to roles: {self.allowed_roles}")

        return True

    @classmethod
    def allow_roles(cls, *roles):
        return type('CustomRolePermission', (cls,), {'allowed_roles': roles})


class DefaultRolePermission(BasePermission):
    """
    Default permission logic:
    - 'admin' and 'teacher': full access
    - 'student': read-only access (GET, HEAD, OPTIONS)
    - others: denied
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        role = getattr(user, 'role', None) or request.auth.get('role')

        if role in ['admin', 'teacher']:
            return True
        elif role == 'student':
            if request.method in SAFE_METHODS:
                return True
            raise PermissionDenied("Students are allowed read-only access.")
        else:
            raise PermissionDenied("Access denied.")