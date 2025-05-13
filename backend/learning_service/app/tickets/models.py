from django.db import models
from pdr.models import RuleSection, TrafficRule


class Question(models.Model):
    section = models.ForeignKey(RuleSection, on_delete=models.CASCADE, related_name='questions')
    ticket_number = models.CharField(max_length=10)
    question_number = models.CharField(max_length=10, unique=True)
    text = models.TextField()
    reply_text = models.TextField(blank=True, null=True)
    rule = models.ForeignKey(TrafficRule, on_delete=models.CASCADE, related_name='questions',
                             blank=True, null=True)
    image = models.ImageField(upload_to='questions/', null=True, blank=True)

    def __str__(self):
        return f"Question №{self.question_number} (Ticket №{self.ticket_number})"


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer to Q{self.question.question_number}: {self.text[:50]}"


class Ticket(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Наприклад, "Білет №48"
    ticket_number = models.CharField(max_length=10, unique=True, null=True, blank=True)  # для офіційних білетів
    is_custom = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class TicketQuestion(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='questions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='tickets')
    order = models.PositiveIntegerField()  # Це поле дозволить впорядковувати питання в білеті

    def __str__(self):
        return f"Ticket: {self.ticket.name}"
