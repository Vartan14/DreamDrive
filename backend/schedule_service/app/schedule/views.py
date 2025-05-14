from rest_framework import viewsets, generics, mixins

from core.permissions import RolePermission
from .models import TheoryLesson, PracticeLesson
from .serializers import TheoryLessonSerializer, PracticeLessonSerializer


class TheoryLessonViewSet(viewsets.ModelViewSet):
    """Instructor CRUD for theory lessons"""
    queryset = TheoryLesson.objects.all()
    serializer_class = TheoryLessonSerializer
    permission_classes = [RolePermission.allow_roles('Instructor')]


class ReadOnlyTheoryLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Students can get their theory lessons"""
    queryset = TheoryLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('Student')]

    def get_queryset(self):
        group_id = self.request.user.group_id
        queryset = TheoryLesson.objects.filter(group_id=group_id)
        return queryset

class PracticeLessonViewSet(viewsets.ModelViewSet):
    """Instructor CRUD for practice lessons"""
    queryset = PracticeLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('Instructor')]

    def perform_create(self, serializer):
        serializer.save(status='available', instructor_id=self.request.user.id)


class ReadOnlyPracticeLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Students can get their practice lessons"""
    queryset = PracticeLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('Student')]

    def get_queryset(self):
        group_id = self.request.user.group_id
        queryset = TheoryLesson.objects.filter(group_id=group_id)
        return queryset


class ListAvailablePracticeLessons(generics.ListAPIView):
    """Students can get available practice lessons"""
    queryset = PracticeLesson.objects.filter(status='available')
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('Student')]


class BookPracticeLessonView(generics.CreateAPIView):
    """Student can book available practice lesson"""
    queryset = PracticeLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('Student')]

    def perform_create(self, serializer):

        lesson = PracticeLesson.objects.get(id=self.request.data['lesson'])
        if lesson.status == 'available':
            lesson.status = 'booked'
            lesson.student_id = self.request.user.id
            lesson.save()


        serializer.save(student_id=self.request.user.id)