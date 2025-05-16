from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, generics, mixins, status
from rest_framework.response import Response

from core.permissions import RolePermission
from .models import TheoryLesson, PracticeLesson
from .serializers import (TheoryLessonSerializer,
                          PracticeLessonSerializer,
LessonCalendarSerializer, LessonTimelineSerializer)

"""
Student views
"""
@extend_schema(tags=["Student"])
class ReadOnlyTheoryLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Students can get their theory lessons"""
    queryset = TheoryLesson.objects.all()
    serializer_class = TheoryLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]

    def get_queryset(self):
        group_id = self.request.headers.get('X-User-Group-Id')
        if not group_id:
            raise ValueError("Header 'X-User-Group-Id' is required.")
        queryset = TheoryLesson.objects.filter(group_id=group_id)
        return queryset

@extend_schema(tags=["Student"])
class ReadOnlyPracticeLessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Students can get their practice lessons"""
    queryset = PracticeLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]

    def get_queryset(self):
        user_id = self.request.user.id
        queryset = PracticeLesson.objects.filter(student_id=user_id)
        return queryset


@extend_schema(tags=["Student"])
class ListAvailablePracticeLessons(generics.ListAPIView):
    """Students can get available practice lessons"""
    queryset = PracticeLesson.objects.filter(status='available')
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]



@extend_schema(tags=["Student"], methods=["PATCH"])
class BookPracticeLessonView(generics.UpdateAPIView):
    """Student can book available practice lesson. Updating Practice Lesson object"""
    queryset = PracticeLesson.objects.all()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('student')]


    def perform_update(self, serializer):
        if serializer.instance.status != 'available':
            raise ValidationError('This lesson is not available now')

        if serializer.instance.student_id is not None:
            raise ValidationError('This lesson is already booked by another student')

        serializer.save(
            status='booked',
            student_id=self.request.user.id
        )

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method PUT not allowed."},
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)

"""
Teacher views
"""
@extend_schema(tags=["Teacher"])
class TheoryLessonViewSet(viewsets.ModelViewSet):
    """Teacher CRUD for theory lessons"""
    queryset = TheoryLesson.objects.none()
    serializer_class = TheoryLessonSerializer
    permission_classes = [RolePermission.allow_roles('teacher')]

    def get_queryset(self):
        instructor_id = self.request.user.id
        queryset = TheoryLesson.objects.filter(instructor_id=instructor_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(instructor_id=self.request.user.id)


@extend_schema(tags=["Teacher"])
class PracticeLessonViewSet(viewsets.ModelViewSet):
    """Teacher CRUD for practice lessons"""
    queryset = PracticeLesson.objects.none()
    serializer_class = PracticeLessonSerializer
    permission_classes = [RolePermission.allow_roles('teacher')]

    def get_queryset(self):
        instructor_id = self.request.user.id
        queryset = TheoryLesson.objects.filter(instructor_id=instructor_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(status='available', instructor_id=self.request.user.id)


@extend_schema(tags=["Teacher"])
class InstructorCalendarEvents(generics.ListAPIView):
    permission_classes = [RolePermission.allow_roles('teacher')]
    serializer_class = LessonCalendarSerializer

    def get_queryset(self):
        date = self.request.query_params.get('date')

        if not date:
            raise ValidationError("Date parameter is required.")

        start = f"{date}T00:00:00"
        end = f"{date}T23:59:59"

        try:
            instructor_id = self.request.user.id

            theory = TheoryLesson.objects.filter(instructor_id=instructor_id, start_time__range=[start, end])
            practice = PracticeLesson.objects.filter(instructor_id=instructor_id, start_time__range=[start, end])
        except ValueError:
            raise ValidationError("Invalid date format. Expected format is yyyy-mm-dd.")

        return list(theory) + list(practice)






@extend_schema(tags=["Teacher"])
class InstructorTimelineView(generics.ListAPIView):
    permission_classes = [RolePermission.allow_roles('teacher')]
    serializer_class = LessonTimelineSerializer

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
@extend_schema(tags=["Admin"])
class AdminScheduleView(generics.ListAPIView):
    permission_classes = [RolePermission.allow_roles('admin')]
    serializer_class = LessonCalendarSerializer

    def get_queryset(self):
        date = self.request.query_params.get('date')

        if not date:
            raise ValueError("Date parameter is required.")

        start = f"{date}T00:00:00"
        end = f"{date}T23:59:59"

        try:
            theory = TheoryLesson.objects.filter(start_time__range=[start, end])
            practice = PracticeLesson.objects.filter(start_time__range=[start, end])
        except ValueError:
            raise ValueError("Invalid date format. Expected format is yyyy-mm-dd.")

        return list(theory) + list(practice)

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
