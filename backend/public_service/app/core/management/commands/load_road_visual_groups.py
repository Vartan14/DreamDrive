import json
from django.core.management.base import BaseCommand
from pdr.models import RoadVisualGroup



class Command(BaseCommand):
    help = "Load sign and marking groups from a JSON file"

    def handle(self, *args, **kwargs):
        with open("data/sign_groups_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        RoadVisualGroup.objects.all().delete()
        for item in data:
            RoadVisualGroup.objects.create(number=item["number"], title=item["title"], type=item["type"])

        self.stdout.write(self.style.SUCCESS(f"Loaded {len(data)} sign and marking groups"))
