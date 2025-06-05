from rest_framework.routers import DefaultRouter
from .views import (
    TrafficRuleViewSet,
    RuleSectionViewSet,
    RoadVisualElementViewSet,
    RoadVisualGroupViewSet,
)

router = DefaultRouter()
router.register(r'rules', TrafficRuleViewSet)
router.register(r'rule-sections', RuleSectionViewSet)
router.register(r'signs-and-markings', RoadVisualElementViewSet)
router.register(r'sign-and-marking-groups', RoadVisualGroupViewSet)

urlpatterns = router.urls
