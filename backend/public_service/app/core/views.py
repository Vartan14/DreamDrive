
from .permissions import DefaultRolePermission
from rest_framework import viewsets
from .models import Filial, Review, FAQ, LandingElement, PricePlan
from .serializers import (
    FilialSerializer,
    ReviewSerializer,
    FAQSerializer,
    LandingElementSerializer,
    PricePlanSerializer,
)




class FilialViewSet(viewsets.ModelViewSet):
    queryset = Filial.objects.all()
    serializer_class = FilialSerializer
    permission_classes = [DefaultRolePermission]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [DefaultRolePermission]


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [DefaultRolePermission]


class LandingElementViewSet(viewsets.ModelViewSet):
    queryset = LandingElement.objects.all()
    serializer_class = LandingElementSerializer
    permission_classes = [DefaultRolePermission]


class PricePlanViewSet(viewsets.ModelViewSet):
    queryset = PricePlan.objects.all()
    serializer_class = PricePlanSerializer
    permission_classes = [DefaultRolePermission]

