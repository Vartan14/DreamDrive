"""Serializers for user profiles."""
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions
from user_profile.models import StudentProfile, TeacherProfile
from .serializers import StudentProfileSerializer, TeacherProfileSerializer


@extend_schema(tags=["Student Profiles"])
class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAdminUser]


@extend_schema(tags=["Teacher Profiles"])
class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [permissions.IsAdminUser]