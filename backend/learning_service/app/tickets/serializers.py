from rest_framework import serializers
from .models import Question, Answer, Ticket, TicketQuestion


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    section_number = serializers.IntegerField(source='section.number', read_only=True)
    section_title = serializers.CharField(source='section.title', read_only=True)

    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'section_number', 'section_title', 'ticket_number', 'question_number',
                  'text', 'reply_text', 'rule', 'image', 'answers']




class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'name', 'ticket_number', 'is_custom', 'created_at']


class TicketQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketQuestion
        fields = ['id', 'ticket', 'question', 'order']