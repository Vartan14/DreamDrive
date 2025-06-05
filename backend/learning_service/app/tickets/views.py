from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from core.permissions import RolePermission, DefaultRolePermission
from .models import Question, Answer, Ticket, TicketQuestion
from .serializers import QuestionSerializer, AnswerSerializer, TicketSerializer, TicketQuestionSerializer


class QuestionPagination(PageNumberPagination):
    page_size = 20


@extend_schema(tags=["Tickets / Questions"])
class QuestionViewSet(viewsets.ModelViewSet):
    """
    Question CRUD + GET request with section=<id> param
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    #filter_backends = [DjangoFilterBackend]
    #filterset_fields = ['section']  # ← підтримує ?section=<id>
    permission_classes = [DefaultRolePermission]
    pagination_class = QuestionPagination

    def get_queryset(self):
        """
        Return questions related to specified section in query_param
        """
        queryset = Question.objects.all()
        section = self.request.query_params.get('section')

        if section is None:
            section = '1'

        queryset = queryset.filter(section__number=section)
        return queryset


@extend_schema(tags=["Tickets / Answers"])
class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]


@extend_schema(tags=["Tickets"])
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]

@extend_schema(tags=["Tickets / Ticket Questions"])
class TicketQuestionViewSet(viewsets.ModelViewSet):
    queryset = TicketQuestion.objects.all()
    serializer_class = TicketQuestionSerializer
    permission_classes = [RolePermission.allow_roles('admin', 'teacher')]

