"""Serializers for user profile models."""
from rest_framework import serializers

from user.models import User
from user.serializers import UserSerializer
from .models import StudentProfile, TeacherProfile, Group


class StudentProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    #type = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ['id', 'user_id', 'first_name', 'last_name', 'email', 'progress', 'type',
                  'group_id']


    # def get_type(self, obj):
    #     student_type = obj.type
    #     if student_type == 'theory':
    #         return 'Теорія'
    #     elif student_type == 'practice':
    #         return 'Практика'
    #     else:
    #         return 'Теорія та практика'


    def validate_user(self, value):
        if value.role != value.Role.STUDENT:
            raise serializers.ValidationError("User must have the role 'student' to create a StudentProfile.")
        return value


class TeacherProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    teacher_id = serializers.IntegerField(source='id', read_only=True)
    groups = serializers.SerializerMethodField()
    name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = TeacherProfile
        fields = ('teacher_id', 'id', 'name', 'type') + ('groups',)


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
