from rest_framework import serializers
from .models import TrafficRule, RuleSection, RoadVisualElement, RoadVisualGroup


class RoadVisualGroupSerializer(serializers.ModelSerializer):
    """
    Serializer for RoadVisualGroup model.
    """

    class Meta:
        model = RoadVisualGroup
        fields = ['id', 'type', 'number', 'title']


class RoadVisualElementSerializer(serializers.ModelSerializer):
    """
    Serializer for RoadVisualElement model.
    """
    group_number = serializers.CharField(source='group.number', read_only=True)

    class Meta:
        model = RoadVisualElement
        fields = ['id', 'element_id', 'name', 'text', 'image', 'group_number']


class RuleSectionSerializer(serializers.ModelSerializer):
    """
    Serializer for RuleSection model.
    """

    class Meta:
        model = RuleSection
        fields = ['id', 'number', 'title']


class TrafficRuleSerializer(serializers.ModelSerializer):
    """
    Serializer for TrafficRule model.
    """
    section_number = serializers.CharField(source='section.number', read_only=True)

    class Meta:
        model = TrafficRule
        fields = ['id','rule_id', 'text', 'section_number']
