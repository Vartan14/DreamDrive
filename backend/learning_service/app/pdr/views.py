from rest_framework import viewsets

from core.permissions import RolePermission, DefaultRolePermission
from .models import TrafficRule, RuleSection, RoadVisualElement, RoadVisualGroup
from .serializers import (
    TrafficRuleSerializer,
    RuleSectionSerializer,
    RoadVisualElementSerializer,
    RoadVisualGroupSerializer,
)


class RoadVisualGroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing road visual groups.
    """
    queryset = RoadVisualGroup.objects.all()
    serializer_class = RoadVisualGroupSerializer
    permission_classes = [DefaultRolePermission]


class RoadVisualElementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing road visual elements.
    """
    queryset = RoadVisualElement.objects.all()
    serializer_class = RoadVisualElementSerializer
    permission_classes = [DefaultRolePermission]


class RuleSectionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing rule sections.
    """
    queryset = RuleSection.objects.all()
    serializer_class = RuleSectionSerializer
    permission_classes = [DefaultRolePermission]


class TrafficRuleViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing traffic rules.
    """
    queryset = TrafficRule.objects.all()
    serializer_class = TrafficRuleSerializer
    permission_classes = [DefaultRolePermission]

