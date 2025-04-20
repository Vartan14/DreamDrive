"""
Database models for the authentication service.
"""
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import (AbstractBaseUser,
                                        BaseUserManager,
                                        PermissionsMixin)


class UserManager(BaseUserManager):
    """Manager for Users"""
    def create_user(self, email, password, **extra_fields):
        """Create and return a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        extra_fields.setdefault('role', User.Role.STUDENT)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """Create and return a new superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('role') != User.Role.ADMIN:
            raise ValueError('Superuser must have role=ADMIN.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model
    """
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        TEACHER = 'teacher', 'Teacher'
        STUDENT = 'student', 'Student'

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
    )
    birth_date = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        """Return string representation of the user"""
        return f"{self.email} ({self.role})"

    def save(self, *args, **kwargs):
        """Override save method to set is_paid to None for non-student roles."""
        if self.role != self.Role.STUDENT:
            self.is_paid = None
        super().save(*args, **kwargs)

    def get_full_name(self):
        """Return full name of the user."""
        return f"{self.first_name} {self.last_name}"


class Filial(models.Model):
    """Represents a branch of the driving school."""
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.city} - {self.address}"


class DrivingCategory(models.Model):
    """Driving categories (e.g., A, B, C)."""
    name = models.CharField(max_length=5, unique=True)

    def __str__(self):
        return self.name


class TeacherProfile(models.Model):
    """Profile for teacher or instructor users."""

    class TeachingType(models.TextChoices):
        THEORY = 'theory', 'Theory'
        PRACTICE = 'practice', 'Practice'

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )
    type = models.CharField(
        max_length=20,
        choices=TeachingType.choices
    )

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_type_display()})"


class Group(models.Model):
    """Learning group for students."""

    class GroupType(models.TextChoices):
        THEORY = 'theory', 'Theory'
        PRACTICE = 'practice', 'Practice'

    name = models.CharField(max_length=100)
    driving_category = models.ForeignKey(
        DrivingCategory,
        on_delete=models.CASCADE,
        related_name='groups'
    )
    teacher = models.ForeignKey(
        TeacherProfile,
        on_delete=models.CASCADE,
        related_name='groups',
        null=True,
        blank=True
    )
    filial = models.ForeignKey(
        Filial,
        on_delete=models.CASCADE,
        related_name='groups'
    )
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

    def __str__(self):
        return self.user.get_full_name()
