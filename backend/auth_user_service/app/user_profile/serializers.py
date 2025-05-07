"""Serializers for user profile models."""
from rest_framework import serializers
from core.models import StudentProfile, TeacherProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'group']
        read_only_fields = ['id']


class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['id', 'user', 'type']
        read_only_fields = ['id']
