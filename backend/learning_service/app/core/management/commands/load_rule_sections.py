import json
from django.core.management.base import BaseCommand
from pdr.models import RuleSection


class Command(BaseCommand):
    help = "Load rule sections from a JSON file"


    def handle(self, *args, **kwargs):
        json_path = "data/ticket_sections.json"

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        RuleSection.objects.all().delete()
        for item in data:
            RuleSection.objects.create(number=item["number"], title=item["title"])

        self.stdout.write(self.style.SUCCESS(f"Loaded {len(data)} rule sections"))
