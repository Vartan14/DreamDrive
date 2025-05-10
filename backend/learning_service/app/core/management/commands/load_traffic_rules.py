import json
from django.core.management.base import BaseCommand
from pdr.models import TrafficRule, RuleSection


class Command(BaseCommand):
    help = "Load traffic rules from a JSON file"

    def handle(self, *args, **kwargs):
        try:
            # Зчитуємо дані з файлу
            with open("data/traffic_rules_data.json", "r", encoding="utf-8") as f:
                data = json.load(f)

            # Створюємо список об'єктів для збереження
            traffic_rules = []
            for item in data:
                # Знаходимо відповідну секцію за її номером та назвою
                section = RuleSection.objects.filter(number=item["section_number"], title=item["section_title"]).first()
                if section:
                    # Створюємо нове правило
                    traffic_rules.append(
                        TrafficRule(
                            rule_id=item["id"],
                            section=section,
                            text=item["text"]
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(f"Section {item['section_number']} - {item['section_title']} not found"))

            # Завантажуємо всі нові записи
            TrafficRule.objects.bulk_create(traffic_rules)

            self.stdout.write(self.style.SUCCESS(f"Loaded {len(data)} traffic rules successfully"))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("The file 'data/traffic_rules_data.json' was not found"))
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("Error parsing the JSON file"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred: {str(e)}"))
