from rest_framework import serializers
from core.models import Group, Filial, DrivingCategory


class FilialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filial
        fields = ['id', 'city', 'address', 'description']

class DrivingCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DrivingCategory
        fields = ['id', 'name']

class GroupSerializer(serializers.ModelSerializer):
    driving_category = DrivingCategorySerializer()
    teacher = serializers.StringRelatedField()
    filial = FilialSerializer()

    class Meta:
        model = Group
        fields = ['id', 'name', 'driving_category', 'teacher', 'filial', 'type']
