import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone

from tickets.models import Ticket, Question, Answer
from .models import TicketTestSession, TicketTestAnswer



class StartTicketTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ticket_id = request.data.get("ticket_id")
        use_random = request.data.get("random", False)

        if use_random:
            tickets = Ticket.objects.all()
            if not tickets.exists():
                return Response({"detail": "No tickets available."}, status=status.HTTP_404_NOT_FOUND)
            ticket = random.choice(tickets)
        else:
            if not ticket_id:
                return Response({"detail": "ticket_id is required unless random=true."},
                                status=status.HTTP_400_BAD_REQUEST)
            ticket = get_object_or_404(Ticket, id=ticket_id)

        # Create new test session
        session = TicketTestSession.objects.create(
            user_id=request.user.id,
            ticket=ticket
        )

        # Get all ticket questions
        ticket_questions = ticket.questions.all().order_by("order")  # через related_name
        questions_payload = []

        for tq in ticket_questions:
            TicketTestAnswer.objects.create(
                session=session,
                question=tq.question
            )

            answers = Answer.objects.filter(question=tq.question).values("id", "text", "is_correct")
            questions_payload.append({
                "id": tq.question.id,
                "question_number": tq.question.question_number,
                "text": tq.question.text,
                "image": tq.question.image.url if tq.question.image else None,
                "answers": list(answers)
            })

        return Response({
            "session_id": session.id,
            "ticket_id": ticket.id,
            "ticket_number": ticket.ticket_number,
            "questions": questions_payload
        }, status=status.HTTP_201_CREATED)


class SubmitTicketTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_id = request.data.get("session_id")
        answers_data = request.data.get("answers", [])

        if not session_id or not answers_data:
            return Response(
                {"detail": "session_id and answers are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            session = TicketTestSession.objects.get(id=session_id, user_id=request.user.id)
        except TicketTestSession.DoesNotExist:
            return Response({"detail": "Test session not found."}, status=status.HTTP_404_NOT_FOUND)

        if session.completed_at:
            return Response({"detail": "Test already completed."}, status=status.HTTP_400_BAD_REQUEST)

        mistakes = 0

        for answer_entry in answers_data:
            question_id = answer_entry.get("question_id")
            selected_answer_id = answer_entry.get("selected_answer_id")
            answered_at = answer_entry.get("answered_at")

            if not question_id or not selected_answer_id:
                continue  # skip invalid input

            try:
                answer = Answer.objects.get(id=selected_answer_id, question_id=question_id)
            except Answer.DoesNotExist:
                continue

            test_answer = TicketTestAnswer.objects.get(session=session, question_id=question_id)
            test_answer.selected_answer = answer
            test_answer.is_correct = answer.is_correct
            test_answer.answered_at = answered_at
            test_answer.save()

            if not answer.is_correct:
                mistakes += 1

        session.mistakes_count = mistakes
        session.completed_at = timezone.now()
        session.is_passed = mistakes <= 2  # або інша логіка проходження
        session.save()

        return Response({
            "session_id": session.id,
            "completed_at": session.completed_at,
            "mistakes": mistakes,
            "is_passed": session.is_passed,
        }, status=status.HTTP_200_OK)
