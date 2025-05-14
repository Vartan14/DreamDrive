from django.contrib import admin

from .models import TheoryLesson, PracticeLesson


@admin.register(TheoryLesson)
class TheoryLessonAdmin(admin.ModelAdmin):
    list_display = ('start_time', 'instructor_id', 'group_id', 'created_at')


@admin.register(PracticeLesson)
class PracticeLessonAdmin(admin.ModelAdmin):
    list_display = ('start_time', 'instructor_id', 'student_id', 'status')
