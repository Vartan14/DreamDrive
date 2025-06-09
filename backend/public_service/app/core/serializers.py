from rest_framework import serializers
from .models import Filial, Review, FAQ, LandingElement, PricePlan


class FilialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filial
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class LandingElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingElement
        fields = '__all__'


class PricePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricePlan
        fields = '__all__'
