from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import RuleSection, TrafficRule, RoadVisualElement, RoadVisualGroup


@admin.register(RuleSection)
class RuleSectionAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for RuleSection model.
    Displays section number and title, with search and ordering.
    """
    list_display = ("number", "title")
    search_fields = ("number", "title")
    ordering = ("number",)


@admin.register(TrafficRule)
class TrafficRuleAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for TrafficRule model.
    Shows rule ID, related section, and a short preview of the rule text.
    """
    list_display = ("rule_id", "section", "short_text")
    search_fields = ("rule_id", "text")
    list_filter = ("section",)
    ordering = ("rule_id",)

    def short_text(self, obj):
        """
        Returns a truncated preview of the traffic rule text.
        """
        return obj.text[:75] + "..." if len(obj.text) > 75 else obj.text
    short_text.short_description = "Text Preview"


@admin.register(RoadVisualGroup)
class RoadVisualGroupAdmin(admin.ModelAdmin):
    """
    Admin interface for RoadVisualGroup model.
    """
    list_display = ("number","type", "title")
    search_fields = ("number","type", "title")
    ordering = ("type", "number")


@admin.register(RoadVisualElement)
class RoadVisualElementAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for RoadVisualElement model.
    Displays element type, group name, code, and a short description.
    """
    list_display =  ("group", "element_id", "name")
    search_fields = ("element_id", "name")
    list_filter = ("group",)
