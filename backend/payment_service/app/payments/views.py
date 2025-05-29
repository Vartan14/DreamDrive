import base64
import hashlib
import json
import uuid

import requests
from drf_spectacular.utils import extend_schema
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from django.conf import settings
from .permissions import RolePermission
from .models import Payment
from .utils import generate_signature
from .serializers import CreatePaymentSerializer, LiqPayCallbackSerializer, PaymentStatusSerializer




@extend_schema(
    request=CreatePaymentSerializer,
    responses={200: "OK"}
)
class CreatePaymentView(APIView):
    permission_classes = [RolePermission.allow_roles('student')]
    serializer_class = CreatePaymentSerializer

    def post(self, request):
        user = request.user
        amount = request.data.get("amount")
        description = request.data.get("description", "Оплата в DreamDrive")
        order_id = str(uuid.uuid4())

        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            "public_key": settings.LIQPAY_PUBLIC_KEY,
            "version": "3",
            "action": "pay",
            "amount": amount,
            "currency": "UAH",
            "description": description,
            "order_id": order_id,
            "sandbox": 1,
            "result_url": settings.LIQPAY_RESULT_URL,
            "server_url": settings.LIQPAY_CALLBACK_URL,
        }

        encoded_data, signature = generate_signature(data)

        Payment.objects.create(
            user_id=user.id,
            amount=amount,
            description=description,
            liqpay_order_id=order_id
        )

        return Response({
            "data": encoded_data,
            "signature": signature,
            "liqpay_url": "https://www.liqpay.ua/api/3/checkout",
            "user_id": user.id
        })


@extend_schema(
    request=LiqPayCallbackSerializer,
    responses={200: "Callback received"}
)
class LiqPayCallbackView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LiqPayCallbackSerializer

    def post(self, request):
        data = request.data.get("data")
        signature = request.data.get("signature")

        if not data or not signature:
            return Response({'error': 'Missing data or signature'}, status=status.HTTP_400_BAD_REQUEST)

        expected_signature = base64.b64encode(
            hashlib.sha1((settings.LIQPAY_PRIVATE_KEY + data + settings.LIQPAY_PRIVATE_KEY).encode()).digest()
        ).decode()

        if signature != expected_signature:
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = json.loads(base64.b64decode(data).decode())
        except Exception as e:
            return Response({'error': 'Failed to decode data'}, status=status.HTTP_400_BAD_REQUEST)

        order_id = decoded.get("order_id")
        if not order_id:
            return Response({'error': 'Missing order_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = Payment.objects.get(liqpay_order_id=order_id)
            payment_status = decoded.get("status")
            if payment_status in ('success', 'sandbox'):
                payment.status = 'success'


                try:
                    response = requests.post(
                        url=settings.AUTH_SERVICE_URL ,
                        headers={"X-API-KEY": f"{settings.PAYMENT_API_KEY}"},
                        json={"user_id": payment.user_id}
                    )
                    if response.status_code != 200:
                        print("Response status code:", response.status_code)
                        print("Error:", response.text)
                        payment.status = 'error'
                except Exception as e:
                    print("Помилка при оновленні статусу користувача:", str(e))
                    payment.status = 'error'

            else:
                payment.status = 'failure'

            payment.liqpay_data = decoded
            payment.save()
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'status': 'ok'})


class PaymentStatusView(RetrieveAPIView):
    permission_classes = [RolePermission.allow_roles('student')]

    def get(self, request):
        try:
            user_id = request.user.id
            payment = Payment.objects.filter(user_id=user_id).latest('created_at')
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PaymentStatusSerializer(payment)
        return Response(serializer.data)