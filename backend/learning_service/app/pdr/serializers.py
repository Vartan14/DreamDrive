from rest_framework import serializers
from .models import TrafficRule, RuleSection, RoadVisualElement, RoadVisualGroup


class RoadVisualGroupSerializer(serializers.ModelSerializer):
    """
    Serializer for RoadVisualGroup model.
    """

    class Meta:
        model = RoadVisualGroup
        fields = '__all__'


class RoadVisualElementSerializer(serializers.ModelSerializer):
    """
    Serializer for RoadVisualElement model.
    """

    class Meta:
        model = RoadVisualElement
        fields = '__all__'


class RuleSectionSerializer(serializers.ModelSerializer):
    """
    Serializer for RuleSection model.
    """

    class Meta:
        model = RuleSection
        fields = ['number', 'title']


class TrafficRuleSerializer(serializers.ModelSerializer):
    """
    Serializer for TrafficRule model.
    """

    class Meta:
        model = TrafficRule
        fields = ['rule_id', 'section', 'text']
