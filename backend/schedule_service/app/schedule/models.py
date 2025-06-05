from datetime import timedelta

from django.db import models


class TheoryLesson(models.Model):
    """Theoretical lessons. Instructors add students"""
    title = models.CharField(max_length=100, default='Theoretical lesson')
    status = models.CharField(max_length=10, choices=[
        ('active', 'Active'),
        ('cancelled', 'Cancelled')
    ], default='active')
    start_time = models.DateTimeField()
    duration = models.DurationField(default=timedelta(minutes=60))

    is_online = models.BooleanField(default=False)
    filial_id = models.IntegerField()

    instructor_id = models.IntegerField()
    instructor_name = models.CharField(max_length=255, default='')
    group_id = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Theory Lesson on {self.start_time}"


class PracticeLesson(models.Model):
    """Practical lessons with time slots that students can book."""
    title = models.CharField(max_length=100, default='Practical lesson')
    status = models.CharField(max_length=10, choices=[
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='available')

    start_time = models.DateTimeField()
    duration = models.DurationField(default=timedelta(minutes=60))

    filial_id = models.IntegerField()

    instructor_id = models.IntegerField()
    instructor_name = models.CharField(max_length=255, default='')

    location = models.CharField(max_length=255)
    car = models.CharField(max_length=100, null=True, blank=True)

    student_id = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Practice Lesson on {self.start_time}"

