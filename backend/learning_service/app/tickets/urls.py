from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, AnswerViewSet, TicketViewSet, TicketQuestionViewSet

router = DefaultRouter()

router.register(r'', TicketViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'ticket-questions', TicketQuestionViewSet)

urlpatterns = router.urls