from rest_framework import serializers
from core.models import Group


class GroupSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'driving_category', 'teacher', 'filial_id', 'type']
