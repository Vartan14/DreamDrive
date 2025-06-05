from django.urls import path
from .views import StartTicketTestView, SubmitTicketTestView

urlpatterns = [
    path('start/', StartTicketTestView.as_view(), name='start_ticket_test'),
    path('submit/', SubmitTicketTestView.as_view(), name='submit_ticket_test'),
]
