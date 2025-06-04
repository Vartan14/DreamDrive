from django.contrib import admin

from .models import TheoryLesson, PracticeLesson


@admin.register(TheoryLesson)
class TheoryLessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'title','start_time','duration', 'instructor_id', 'group_id', 'created_at', 'status')


@admin.register(PracticeLesson)
class PracticeLessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'title','start_time', 'instructor_id', 'status', 'student_id', )
