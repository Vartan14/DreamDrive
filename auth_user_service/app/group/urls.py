from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GroupViewSet, FilialViewSet, DrivingCategoryViewSet


app_name = 'group'
router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'filials', FilialViewSet, basename='filial')
router.register(r'driving-categories', DrivingCategoryViewSet, basename='driving-category')


urlpatterns = [
    path('', include(router.urls)),
]
