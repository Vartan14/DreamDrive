from django.contrib import admin
from .models import Group, StudentProfile, TeacherProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'get_email', 'get_full_name', 'group_id')


admin.site.register(Group)
admin.site.register(TeacherProfile)
