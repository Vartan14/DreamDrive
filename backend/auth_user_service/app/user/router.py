"""Custom router for user service."""
from rest_framework.routers import DefaultRouter
from user.views import UserAdminViewSet

router = DefaultRouter()
router.register(r'admin-users', UserAdminViewSet, basename='admin-users')
urlpatterns = router.urls
