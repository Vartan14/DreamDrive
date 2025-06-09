from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FilialViewSet,
    ReviewViewSet,
    FAQViewSet,
    LandingElementViewSet,
    PricePlanViewSet,
)

router = DefaultRouter()
router.register(r'filials', FilialViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'faq', FAQViewSet)
router.register(r'landing-elements', LandingElementViewSet)
router.register(r'price-plans', PricePlanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
