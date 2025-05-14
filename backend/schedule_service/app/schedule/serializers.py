from rest_framework import serializers
from .models import TheoryLesson, PracticeLesson


class TheoryLessonSerializer(serializers.ModelSerializer):
    """Theory Lesson serializer"""

    class Meta:
        model = TheoryLesson
        fields = ['start_time', 'duration', 'is_online', 'filial_id', 'instructor_id', 'group_id']

    def validate(self, data):
        return data


class PracticeLessonSerializer(serializers.ModelSerializer):
    """Practice Lesson serializer"""
    class Meta:
        model = PracticeLesson
        fields = ['id', 'start_time', 'duration', 'filial_id', 'instructor_id', 'status', 'location', 'car', 'student_id']
