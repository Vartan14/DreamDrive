from django.db import models
from tickets.models import Ticket, Question, Answer


class TicketTestSession(models.Model):
    user_id = models.PositiveIntegerField()  # отримується з JWT
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='test_sessions')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_passed = models.BooleanField(default=False)
    current_question_index = models.PositiveIntegerField(default=0)
    mistakes_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"User {self.user_id} — Ticket №{self.ticket.ticket_number}"


class TicketTestAnswer(models.Model):
    session = models.ForeignKey(TicketTestSession, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User {self.session.user_id} answered Q{self.question.question_number}"
