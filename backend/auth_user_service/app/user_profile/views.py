"""Serializers for user profiles."""
from django.utils.timezone import override
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions

from core.permissions import RolePermission, DefaultRolePermission
from user_profile.models import StudentProfile, TeacherProfile
from .serializers import StudentProfileSerializer, TeacherProfileSerializer


@extend_schema(tags=["Student Profiles"])
class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]


@extend_schema(tags=["Teacher Profiles"])
class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [DefaultRolePermission]


    def get_object(self):
        user_id = self.kwargs.get('pk')
        return TeacherProfile.objects.get(user__id=user_id)  # Шукаєм

