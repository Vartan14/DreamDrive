from django.db import models

class Payment(models.Model):
    class Status(models.TextChoices):
        SUCCESS = 'success', 'Success'
        FAILURE = 'failure', 'Failure'
        PENDING = 'pending', 'Pending'
        ERROR = 'error', 'Error'

    user_id = models.IntegerField()  # external user ID
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='UAH')
    description = models.CharField(max_length=255)
    liqpay_order_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    liqpay_data = models.JSONField(blank=True, null=True)  # full callback data for audit/debug

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User {self.user_id} - {self.amount} {self.currency} - {self.status}"
