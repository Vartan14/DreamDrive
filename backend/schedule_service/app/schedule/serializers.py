from rest_framework import serializers
from .models import TheoryLesson, PracticeLesson


class TheoryLessonSerializer(serializers.ModelSerializer):
    """Theory Lesson serializer"""

    class Meta:
        model = TheoryLesson
        fields = '__all__'
        read_only_fields = ('instructor_id', 'created_at')


class PracticeLessonSerializer(serializers.ModelSerializer):
    """Practice Lesson serializer"""
    class Meta:
        model = PracticeLesson
        fields = ['id', 'start_time', 'duration', 'filial_id', 'instructor_id', 'status', 'location', 'car', 'student_id']


class LessonCalendarSerializer(serializers.Serializer):
    """Lesson Calendar serializer"""
    id = serializers.IntegerField()
    type = serializers.SerializerMethodField()
    start_time = serializers.DateTimeField()
    duration = serializers.DurationField()
    instructor_id = serializers.IntegerField()
    group_id = serializers.IntegerField(allow_null=True, required=False)
    student_id = serializers.IntegerField(allow_null=True, required=False)
    location = serializers.CharField(allow_blank=True, required=False)
    status = serializers.CharField(allow_blank=True, required=False)
    is_online = serializers.BooleanField(required=False)
    car = serializers.CharField(allow_blank=True, required=False)

    def get_type(self, instance):
        if isinstance(instance, TheoryLesson):
            return 'theory'
        elif isinstance(instance, PracticeLesson):
            return 'practice'
        return None

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if isinstance(instance, TheoryLesson):
            rep['type'] = 'theory'
            rep['group_id'] = instance.group_id
            rep['is_online'] = instance.is_online

            # Useless Fields
            rep['student_id'] = None
            rep['location'] = ''
            rep['status'] = ''
            rep['car'] = ''
        elif isinstance(instance, PracticeLesson):
            rep['type'] = 'practice'
            rep['student_id'] = instance.student_id
            rep['location'] = instance.location
            rep['status'] = instance.status
            rep['car'] = instance.car or ''

            # Useless Fields
            rep['group_id'] = None
            rep['is_online'] = False

        return rep


class LessonTimelineSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.SerializerMethodField()
    start_time = serializers.DateTimeField()
    duration = serializers.DurationField()
    instructor_id = serializers.IntegerField()
    description = serializers.SerializerMethodField()

    def get_type(self, instance):
        if isinstance(instance, TheoryLesson):
            return 'theory'
        elif isinstance(instance, PracticeLesson):
            return 'practice'
        return None

    def get_description(self, obj):
        if isinstance(obj, TheoryLesson):
            return f"Theory Lesson, group {obj.group_id}"
        elif isinstance(obj, PracticeLesson):
            booked = f", booked by student {obj.student_id}" if obj.student_id else ", available"
            return f"Practice Lesson at {obj.location}{booked}"
        return ""

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['type'] = 'theory' if isinstance(instance, TheoryLesson) else 'practice'
        return rep
