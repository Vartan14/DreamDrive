from django.core.validators import MinValueValidator, MaxValueValidator
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

    def get_email(self):
        """Return the email of the associated user."""
        return self.user.email if self.user else None

    def get_full_name(self):
        """Return the full name of the associated user."""
        return self.user.get_full_name() if self.user else None



class Group(models.Model):
    """Learning group for students."""

    class GroupType(models.TextChoices):
        THEORY = 'theory', 'Theory'
        PRACTICE = 'practice', 'Practice'
        THEORY_PRACTICE = 'theory_practice', 'Theory and Practice'

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    driving_category = models.CharField(max_length=5)
    teacher = models.ForeignKey(
        TeacherProfile,
        on_delete=models.DO_NOTHING,
        related_name='groups',
        null=True,
        blank=True
    )
    filial_id = models.PositiveIntegerField(null=True, blank=True)
    type = models.CharField(
        max_length=20,
        choices=GroupType.choices
    )

    def __str__(self):
        return f"{self.name} - {self.get_type_display()}"


class StudentProfile(models.Model):
    """Profile for student users."""
    class StudentType(models.TextChoices):
        THEORY = 'theory', 'Theory'
        PRACTICE = 'practice', 'Practice'

    user = models.OneToOneField(
        User,
        on_delete=models.DO_NOTHING,
        related_name='student_profile'
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='students'
    )
    type = models.CharField(
        max_length=20,
        choices=StudentType.choices,
        default=StudentType.THEORY
    )

    progress = models.IntegerField(default=0,
                                   blank=True,
                                   null=True,
                                   validators=[MinValueValidator(0), MaxValueValidator(100)])


    def clean(self):
        if self.user.role != User.Role.STUDENT:
            raise ValidationError("StudentProfile can be assigned only with the role 'student'.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.get_full_name()

    def get_email(self):
        """Return the email of the associated user."""
        return self.user.email if self.user else None

    def get_full_name(self):
        """Return the full name of the associated user."""
        return self.user.get_full_name() if self.user else None
