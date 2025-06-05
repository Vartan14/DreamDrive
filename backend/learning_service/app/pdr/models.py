from django.db import models


class RuleSection(models.Model):
    """Represents a numbered section of traffic rules."""
    number = models.SmallIntegerField(unique=True)
    title = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Rule Section"
        verbose_name_plural = "Rule Sections"
        ordering = ["number"]

    def __str__(self):
        return f"{self.number}. {self.title}"


class TrafficRule(models.Model):
    """Stores a specific traffic rule belonging to a section."""
    rule_id = models.CharField(max_length=10, unique=True)
    section = models.ForeignKey(RuleSection, on_delete=models.CASCADE, related_name="rules")
    text = models.TextField()

    class Meta:
        verbose_name = "Traffic Rule"
        verbose_name_plural = "Traffic Rules"

    def __str__(self):
        return f"Rule {self.rule_id}"


class RoadVisualGroup(models.Model):
    """
    Represents a group/category of road visual elements such as signs or markings.
    """
    ELEMENT_TYPE_CHOICES = [
        ("sign", "Road Sign"),
        ("marking", "Road Marking"),
    ]

    type = models.CharField(max_length=10, choices=ELEMENT_TYPE_CHOICES, default="sign")
    number = models.SmallIntegerField(default=0)
    title = models.CharField(max_length=255, default="Untitled")

    class Meta:
        verbose_name = "Road Visual Groups"
        verbose_name_plural = "Road Visual Groups"

    def __str__(self):
        return f"{self.number}. {self.title}"


class RoadVisualElement(models.Model):
    """Represents a road sign or road marking with visual details."""

    group = models.ForeignKey(RoadVisualGroup, on_delete=models.CASCADE, related_name='visuals')
    element_id = models.CharField(max_length=10)
    name = models.CharField(max_length=255)
    text = models.TextField()
    image = models.ImageField(upload_to='signs-and-markings/', default='signs-and-markings/default.png')

    class Meta:
        verbose_name = "Road Visual Element"
        verbose_name_plural = "Road Visual Elements"

    def __str__(self):
        return f"{self.group.type.upper()}: {self.element_id}"
