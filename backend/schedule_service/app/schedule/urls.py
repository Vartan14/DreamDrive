from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (TheoryLessonViewSet,
                    PracticeLessonViewSet,
                    ReadOnlyTheoryLessonViewSet,
                    ReadOnlyPracticeLessonViewSet,
                    ListAvailablePracticeLessons,
                    BookPracticeLessonView, InstructorCalendarEvents, InstructorTimelineView, AdminScheduleView)


theory_router = DefaultRouter()
practice_router = DefaultRouter()
theory_router.register(r'instructor/theory-lessons', TheoryLessonViewSet, basename='theory')
practice_router.register(r'instructor/practice-lessons', PracticeLessonViewSet, basename='practice')


urlpatterns = [
    # Student
    path('student/theory-lessons/<int:pk>', ReadOnlyTheoryLessonViewSet.as_view({"get": "retrieve"})),
    path('student/theory-lessons/', ReadOnlyTheoryLessonViewSet.as_view({"get": "list"})),

    path('student/practice-lessons/<int:pk>', ReadOnlyPracticeLessonViewSet.as_view({"get": "retrieve"})),
    path('student/practice-lessons/', ReadOnlyPracticeLessonViewSet.as_view({"get": "list"})),

    path('student/available-practice-lessons/', ListAvailablePracticeLessons.as_view()),
    path('student/book-practice-lesson/<int:pk>/', BookPracticeLessonView.as_view()),  # PUT request

    # Instructor
    path('', include(theory_router.urls)),
    path('', include(practice_router.urls)),

    path('instructor/calendar-events/', InstructorCalendarEvents.as_view()),
    path('instructor/lesson-timeline/', InstructorTimelineView.as_view()),
    path('admin/schedule/', AdminScheduleView.as_view()),


]