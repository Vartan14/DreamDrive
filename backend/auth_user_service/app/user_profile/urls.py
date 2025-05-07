from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentProfileViewSet, TeacherProfileViewSet


router = DefaultRouter()
router.register(r'students', StudentProfileViewSet, basename='student')
router.register(r'teachers', TeacherProfileViewSet, basename='teacher')

urlpatterns = [
    path('', include(router.urls)),
]

