"""Serializers for user profile models."""
from rest_framework import serializers

from user.models import User
from user.serializers import UserSerializer
from .models import StudentProfile, TeacherProfile, Group


class StudentProfileSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['student_id', 'group_id']


    def validate_user(self, value):
        if value.role != value.Role.STUDENT:
            raise serializers.ValidationError("User must have the role 'student' to create a StudentProfile.")
        return value


class TeacherProfileSerializer(serializers.ModelSerializer):
    teacher_id = serializers.IntegerField(source='id', read_only=True)
    groups = serializers.SerializerMethodField()

    class Meta:
        model = TeacherProfile
        fields = ('teacher_id', 'type') + ('groups',)


    def get_groups(self, obj):
        """Get groups related with this TeacherProfile."""
        groups = Group.objects.filter(teacher=obj)
        return [{'id': group.id, 'name': group.name, 'type': group.type} for group in groups]

    def validate_user(self, value):
        if value.role != value.Role.TEACHER:
            raise serializers.ValidationError("User must have the role 'teacher' to create a TeacherProfile.")
        return value


class UserWithProfileSerializer(UserSerializer):
    profile = serializers.SerializerMethodField()


    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('profile',)

    def get_profile(self, user):
        if user.role == User.Role.STUDENT and hasattr(user, 'student_profile'):
            return StudentProfileSerializer(user.student_profile).data
        elif user.role == User.Role.TEACHER and hasattr(user, 'teacher_profile'):
            return TeacherProfileSerializer(user.teacher_profile).data
        return None
