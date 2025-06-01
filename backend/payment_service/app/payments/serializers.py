from rest_framework import serializers
from .models import Payment


class CreatePaymentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    description = serializers.CharField(required=False, default="Оплата в DreamDrive")


class LiqPayCallbackSerializer(serializers.Serializer):
    data = serializers.CharField()
    signature = serializers.CharField()


class PaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["liqpay_order_id", "amount", "status", "created_at", "description"]


class PaymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["liqpay_order_id", "amount", "status", "created_at", "description"]
        read_only_fields = ["liqpay_order_id", "amount", "status", "created_at", "description"]