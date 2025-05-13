from rest_framework import serializers
from .models import Question, Answer, Ticket, TicketQuestion


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'section', 'ticket_number', 'question_number', 'text', 'reply_text', 'rule', 'image']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'text', 'is_correct']


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'name', 'ticket_number', 'is_custom', 'created_at']


class TicketQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketQuestion
        fields = ['id', 'ticket', 'question', 'order']