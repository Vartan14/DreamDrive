from drf_spectacular.utils import extend_schema
from rest_framework import viewsets

from core.permissions import RolePermission, DefaultRolePermission
from .models import TrafficRule, RuleSection, RoadVisualElement, RoadVisualGroup
from .serializers import (
    TrafficRuleSerializer,
    RuleSectionSerializer,
    RoadVisualElementSerializer,
    RoadVisualGroupSerializer,
)

@extend_schema(tags=["PDR / Sing And Marking Groups"])
class RoadVisualGroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing road visual groups.
    """
    queryset = RoadVisualGroup.objects.all()
    serializer_class = RoadVisualGroupSerializer
    permission_classes = [DefaultRolePermission]

@extend_schema(tags=["PDR / Signs and Markings"])
class RoadVisualElementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing road visual elements.
    """
    queryset = RoadVisualElement.objects.all()
    serializer_class = RoadVisualElementSerializer
    permission_classes = [DefaultRolePermission]

@extend_schema(tags=["PDR / Rule Sections"])
class RuleSectionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing rule sections.
    """
    queryset = RuleSection.objects.all()
    serializer_class = RuleSectionSerializer
    permission_classes = [DefaultRolePermission]


@extend_schema(tags=["PDR / Traffic Rules"])
class TrafficRuleViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing traffic rules.
    """
    queryset = TrafficRule.objects.all()
    serializer_class = TrafficRuleSerializer
    permission_classes = [DefaultRolePermission]

