from rest_framework import viewsets
from .models import Question, Answer, Ticket, TicketQuestion
from .serializers import QuestionSerializer, AnswerSerializer, TicketSerializer, TicketQuestionSerializer
from core.permissions import RolePermission

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]


class TicketQuestionViewSet(viewsets.ModelViewSet):
    queryset = TicketQuestion.objects.all()
    serializer_class = TicketQuestionSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]

