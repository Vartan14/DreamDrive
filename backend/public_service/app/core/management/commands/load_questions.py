from django.core.management.base import BaseCommand
from tickets.models import Question, Answer, Ticket, TicketQuestion
from pdr.models import RuleSection, TrafficRule
import os
import json
from django.core.files import File
from django.db import IntegrityError


class Command(BaseCommand):
    help = 'Loads questions, answers, tickets, and ticket-question relations from a JSON file'

    def handle(self, *args, **kwargs):
        json_path = 'data/questions.json'

        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f"JSON file not found at path: {json_path}"))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        data = data[999:]

        ticket_question_count = {}

        for item in data:
            section_number = item.get('section_number')
            ticket_number = item.get('ticket_number')
            question_number = item.get('question_number')

            current_count = ticket_question_count.get(ticket_number, 0)
            if current_count >= 20:
                self.stdout.write(f"[SKIP] Ticket №{ticket_number} already has 20 questions.")
                continue

            if Question.objects.filter(question_number=question_number).exists():
                self.stdout.write(f"[SKIP] Question №{question_number} already exists.")
                continue

            # --- Get RuleSection ---
            try:
                section = RuleSection.objects.get(number=section_number)
            except RuleSection.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"[ERROR] RuleSection №{section_number} not found."))
                continue

            # --- Get TrafficRule (optional) ---
            rule = None
            rule_id = item.get("rule_id")
            if rule_id:
                try:
                    rule = TrafficRule.objects.get(rule_id=rule_id)
                except TrafficRule.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"[WARN] Rule ID {rule_id} not found. Linking skipped."))

            # --- Create Question ---
            question = Question(
                section=section,
                ticket_number=ticket_number,
                question_number=question_number,
                text=item.get('question_text'),
                reply_text=item.get('reply_text'),
                rule=rule,
            )

            image_path = item.get("image_path")

            if image_path:
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as img_file:
                        question.image.save(os.path.basename(image_path), File(img_file), save=False)
                else:
                    self.stdout.write(f"[WARN] Image not found at path: {image_path}")

            try:
                question.save()
            except IntegrityError as e:
                self.stdout.write(self.style.ERROR(f"[ERROR] Failed to save question {question_number}: {e}"))
                continue

            # --- Create Answers ---
            for ans in item.get("answers", []):
                Answer.objects.create(
                    question=question,
                    text=ans.get("answer_text"),
                    is_correct=ans.get("is_correct") == "True"
                )

            # --- Get or Create Ticket ---
            ticket_name = f"Білет №{ticket_number}"
            ticket, _ = Ticket.objects.get_or_create(
                ticket_number=ticket_number,
                defaults={'name': ticket_name, 'is_custom': False}
            )

            # --- Create TicketQuestion ---
            order = current_count
            TicketQuestion.objects.create(
                ticket=ticket,
                question=question,
                order=order + 1
            )

            # --- Increment count ---
            ticket_question_count[ticket_number] = current_count + 1

            self.stdout.write(self.style.SUCCESS(
                f"[OK] Added question №{question_number} to ticket №{ticket_number} at position {order + 1}"
            ))
