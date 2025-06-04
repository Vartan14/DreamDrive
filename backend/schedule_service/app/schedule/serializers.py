from rest_framework import serializers
from .models import TheoryLesson, PracticeLesson


class TheoryLessonSerializer(serializers.ModelSerializer):
    """Theory Lesson serializer"""
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = TheoryLesson
        fields = ['id', 'title','start_time', 'end_time', 'duration', 'filial_id', 'instructor_id','instructor_name', 'group_id', 'is_online', 'status']
        read_only_fields = ('instructor_id', 'created_at')

    def get_end_time(self, obj):
        """Calculate end time based on start time and duration."""
        if obj.start_time and obj.duration:
            return obj.start_time + obj.duration
        return None


class PracticeLessonSerializer(serializers.ModelSerializer):
    """Practice Lesson serializer"""
    end_time = serializers.SerializerMethodField()


    class Meta:
        model = PracticeLesson
        fields = ['id', 'title','start_time','end_time', 'duration', 'filial_id', 'instructor_id','instructor_name', 'status', 'location', 'car', 'student_id']
        read_only_fields = ('instructor_id', 'created_at')

    def get_end_time(self, obj):
        """Calculate end time based on start time and duration."""
        if obj.start_time and obj.duration:
            return obj.start_time + obj.duration
        return None

class LessonTimelineSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField()
    data = serializers.SerializerMethodField()

    def get_type(self, obj):
        if isinstance(obj, TheoryLesson):
            return 'theory'
        elif isinstance(obj, PracticeLesson):
            return 'practical'
        return None

    def get_data(self, obj):
        if isinstance(obj, TheoryLesson):
            return TheoryLessonSerializer(obj).data
        elif isinstance(obj, PracticeLesson):
            return PracticeLessonSerializer(obj).data
        return {}


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
            return 'practical'
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



