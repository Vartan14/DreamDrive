from django.db import models
from django.core.exceptions import ValidationError

from user.models import User


class TeacherProfile(models.Model):
    """Profile for teacher or instructor users."""

    class TeachingType(models.TextChoices):
        THEORY = 'theory', 'Theory'
        PRACTICE = 'practice', 'Practice'
        BOTH = 'theory_practice', 'Theory and Practice'

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )
    type = models.CharField(
        max_length=20,
        choices=TeachingType.choices
    )

    def clean(self):
        if self.user.role != User.Role.TEACHER:
            raise ValidationError("TeacherProfile can be assigned only with the role 'teacher'.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_type_display()})"


class Group(models.Model):
    """Learning group for students."""

    class GroupType(models.TextChoices):
        THEORY = 'theory', 'Theory'
        PRACTICE = 'practice', 'Practice'

    name = models.CharField(max_length=100)
    driving_category = models.CharField(max_length=5)
    teacher = models.ForeignKey(
        TeacherProfile,
        on_delete=models.CASCADE,
        related_name='groups',
        null=True,
        blank=True
    )
    # ForeignKey in Public Info Service
    filial_id = models.PositiveIntegerField(null=True, blank=True)
    type = models.CharField(
        max_length=20,
        choices=GroupType.choices
    )

    def __str__(self):
        return f"{self.name} - {self.get_type_display()}"


class StudentProfile(models.Model):
    """Profile for student users."""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )

    def clean(self):
        if self.user.role != User.Role.STUDENT:
            raise ValidationError("StudentProfile can be assigned only with the role 'student'.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.get_full_name()
