"""Views for the group app: allows for CRUD operations on the Group, Filial, and DrivingCategory models."""
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions
from rest_framework.generics import ListAPIView

from core.permissions import RolePermission
from user_profile.models import Group
from .serializers import GroupSerializer, GroupListSerializer


@extend_schema(tags=["Groups"])
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]


@extend_schema(tags=["Instructor Groups"])
class GroupListView(ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupListSerializer
    permission_classes = [RolePermission.allow_roles('teacher')]

    def get_queryset(self):
        """
        Returns the list of groups that the instructor belongs to.
        """
        user = self.request.user

        return Group.objects.filter(teacher__user_id=user.id)
