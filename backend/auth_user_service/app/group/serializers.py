from rest_framework import serializers
from user_profile.models import Group, StudentProfile
from user_profile.serializers import StudentProfileSerializer


class GroupSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'description','driving_category', 'teacher', 'filial_id', 'type']



class GroupListSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()
    totalStudents = serializers.SerializerMethodField()
    students = StudentProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'description','driving_category', 'teacher', 'type', 'totalStudents', 'students']

    def get_totalStudents(self, obj):
        return StudentProfile.objects.filter(group=obj).count()

