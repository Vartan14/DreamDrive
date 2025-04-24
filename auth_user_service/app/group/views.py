"""Views for the group app: allows for CRUD operations on the Group, Filial, and DrivingCategory models."""
from rest_framework import viewsets, permissions

from core.models import Filial, Group, DrivingCategory
from .serializers import FilialSerializer, GroupSerializer, DrivingCategorySerializer


class DrivingCategoryViewSet(viewsets.ModelViewSet):
    queryset = DrivingCategory.objects.all()
    serializer_class = DrivingCategorySerializer
    permission_classes = [permissions.IsAdminUser]


class FilialViewSet(viewsets.ModelViewSet):
    queryset = Filial.objects.all()
    serializer_class = FilialSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser]