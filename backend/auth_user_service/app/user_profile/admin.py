from django.contrib import admin
from .models import Group, StudentProfile, TeacherProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('id','user_id', 'get_email', 'get_full_name', 'group_id')

@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ('id','user_id', 'get_email', 'get_full_name', 'type')

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'type',)
    ordering = ('id',)





