from django.urls import path
from . import views


urlpatterns = [
    path('create-payment/', views.CreatePaymentView.as_view(), name='create_payment'),
    path('callback/', views.LiqPayCallbackView.as_view(), name='liqpay_callback'),
    path('status/', views.PaymentStatusView.as_view(), name='payment-status'),
    path('payment-history/', views.PaymentHistoryView.as_view(), name='payment-history'),
]
