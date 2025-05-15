from rest_framework import viewsets, generics, mixins

from core.permissions import RolePermission
from .models import TheoryLesson, PracticeLesson
from .serializers import (TheoryLessonSerializer,
                          PracticeLessonSerializer,
LessonCalendarSerializer, LessonTimelineSerializer)

"""
Student views
"""
class ReadOnlyTheoryLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Students can get their theory lessons"""
    queryset = TheoryLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]

    def get_queryset(self):
        group_id = self.request.user.group_id
        queryset = TheoryLesson.objects.filter(group_id=group_id)
        return queryset


class ReadOnlyPracticeLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Students can get their practice lessons"""
    queryset = PracticeLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]

    def get_queryset(self):
        user_id = self.request.user.id
        queryset = PracticeLesson.objects.filter(student_id=user_id)
        return queryset


class ListAvailablePracticeLessons(generics.ListAPIView):
    """Students can get available practice lessons"""
    queryset = PracticeLesson.objects.filter(status='available')
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]


class BookPracticeLessonView(generics.UpdateAPIView):
    """Student can book available practice lesson. Updating Practice Lesson object"""
    queryset = PracticeLesson.objects.filter(status='available')
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]

    def perform_update(self, serializer):
        serializer.save(
            status='booked',
            student_id=self.request.user.id
        )


"""
Teacher views
"""
class TheoryLessonViewSet(viewsets.ModelViewSet):
    """Teacher CRUD for theory lessons"""
    queryset = TheoryLesson.objects.all()
    serializer_class = TheoryLessonSerializer
    permission_classes = [RolePermission.allow_roles('teacher')]

    def perform_create(self, serializer):
        serializer.save(instructor_id=self.request.user.id)


class PracticeLessonViewSet(viewsets.ModelViewSet):
    """Teacher CRUD for practice lessons"""
    queryset = PracticeLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('teacher')]

    def perform_create(self, serializer):
        serializer.save(status='available', instructor_id=self.request.user.id)



class InstructorCalendarEvents(generics.ListAPIView):
    permission_classes = [RolePermission.allow_roles('teacher')]
    serializer_class = LessonCalendarSerializer  # окремий легкий serializer

    def get_queryset(self):
        instructor_id = self.request.user.id
        date = self.request.query_params.get('date')  # yyyy-mm-dd
        start = f"{date}T00:00:00"
        end = f"{date}T23:59:59"
        theory = TheoryLesson.objects.filter(instructor_id=instructor_id, start_time__range=[start, end])
        practice = PracticeLesson.objects.filter(instructor_id=instructor_id, start_time__range=[start, end])
        return list(theory) + list(practice)


class InstructorTimelineView(generics.ListAPIView):
    permission_classes = [RolePermission.allow_roles('teacher')]
    serializer_class = LessonTimelineSerializer  # короткий список полів

    def get_queryset(self):
        instructor_id = self.request.user.id
        return sorted(
            list(TheoryLesson.objects.filter(instructor_id=instructor_id)) +
            list(PracticeLesson.objects.filter(instructor_id=instructor_id)),
            key=lambda x: x.start_time
        )


"""
Admin views
"""
class AdminScheduleView(generics.ListAPIView):
    permission_classes = [RolePermission.allow_roles('admin')]
    serializer_class = LessonCalendarSerializer

    def get_queryset(self):
        date = self.request.query_params.get('date')  # yyyy-mm-dd
        start = f"{date}T00:00:00"
        end = f"{date}T23:59:59"
        theory = TheoryLesson.objects.filter(start_time__range=[start, end])
        practice = PracticeLesson.objects.filter(start_time__range=[start, end])
        return list(theory) + list(practice)
