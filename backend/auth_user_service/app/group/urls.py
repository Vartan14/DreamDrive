from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GroupViewSet, GroupListView


app_name = 'groups'
router = DefaultRouter()
router.register(r'', GroupViewSet, basename='groups')


urlpatterns = [
    path('admin/', include(router.urls)),
    path('my/',GroupListView.as_view(), name='my_groups'),
]
