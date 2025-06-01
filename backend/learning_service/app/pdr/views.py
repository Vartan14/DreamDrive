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

    def get_queryset(self):
        """
        Return rule sections filtered by the section number in query params.
        """
        queryset = TrafficRule.objects.all()
        section_number = self.request.query_params.get('section')
        print(f"Section number from query params: {section_number}")

        if section_number:
            try:
                section_number = int(section_number)
                print(f"Filtering by section number: {section_number}")
            except ValueError:
                print("Section number must be an integer.")
                raise ValueError("Section number must be an integer.")

            queryset = queryset.filter(section__number=section_number)

        print(f"Final queryset: {queryset.query}")
        return queryset

