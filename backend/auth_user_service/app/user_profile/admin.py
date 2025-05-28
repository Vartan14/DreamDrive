from django.contrib import admin
from .models import Group, StudentProfile, TeacherProfile


admin.site.register(Group)
admin.site.register(StudentProfile)
admin.site.register(TeacherProfile)
