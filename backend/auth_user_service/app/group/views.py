"""Views for the group app: allows for CRUD operations on the Group, Filial, and DrivingCategory models."""
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions

from user_profile.models import Group
from .serializers import GroupSerializer


@extend_schema(tags=["Groups"])
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser]