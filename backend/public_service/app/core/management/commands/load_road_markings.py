import json
import os

from django.core.files import File
from django.core.management.base import BaseCommand
from pdr.models import RoadVisualElement, RoadVisualGroup


class Command(BaseCommand):
    help = "Load road visual elements from a local JSON file and local images"

    def handle(self, *args, **options):
        json_path = "data/markings.json"

        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f"JSON file not found at: {json_path}"))
            return

        with open(json_path, encoding='utf-8') as f:
            data = json.load(f)

        for item in data:
            group_title = item["sign_group"]
            element_id = item["sign_code"]
            name = item["sign_name"]
            text = item["sign_text"]
            image_path = os.path.normpath(item["img_path"])


            # Створюємо або знаходимо групу
            group, _ = RoadVisualGroup.objects.get_or_create(
                title=group_title,
                defaults={"type": "marking"}  # Якщо треба, можеш уточнювати тип
            )

            # Перевіряємо, чи елемент вже існує
            if RoadVisualElement.objects.filter(element_id=element_id, group=group).exists():
                self.stdout.write(self.style.WARNING(f"Element {element_id} already exists — skipped."))
                continue

            # Перевіряємо існування зображення
            if not os.path.exists(image_path):
                self.stdout.write(self.style.ERROR(f"Image not found at: {image_path}"))
                continue

            # Створення нового RoadVisualElement
            element = RoadVisualElement(
                group=group,
                element_id=element_id,
                name=name,
                text=text
            )

            # Відкриваємо файл і прикріплюємо його до ImageField
            with open(image_path, "rb") as img_file:
                filename = os.path.basename(image_path)
                element.image.save(filename, File(img_file), save=True)

            self.stdout.write(self.style.SUCCESS(f"Added: {element_id} - {name}"))
