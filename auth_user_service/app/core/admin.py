"""
Django admin configuration for the auth_user_service app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from core import models


class UserAdmin(BaseUserAdmin):
    """Define the admin page for users."""
    ordering = ['id']
    list_display = ['email', 'first_name', 'last_name', 'role']

    fieldsets = (
        (_('Personal info'), {'fields': ('email', 'password', 'first_name', 'last_name', 'role')}),
        (_('Permissions'), {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            )
        }),
        (_('Important dates'), {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (_('Personal info'), {
            'classes': ('wide',),
            'fields': (
                'email',
                'first_name',
                'last_name',
                'password1',
                'password2',
                'role',
                'is_active',
                'is_staff',
                'is_superuser',
            ),
        }),
    )


admin.site.register(models.User, UserAdmin)
