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

            # Отримуємо всі існуючі rule_id з бази
            existing_rule_ids = set(TrafficRule.objects.values_list("rule_id", flat=True))

            traffic_rules = []
            skipped_count = 0

            for item in data:
                rule_id = item["id"]

                # Пропускаємо, якщо такий rule_id вже існує
                if rule_id in existing_rule_ids:
                    skipped_count += 1
                    continue

                # Знаходимо відповідну секцію
                section = RuleSection.objects.filter(number=item["section_number"]).first()
                if section:
                    traffic_rules.append(
                        TrafficRule(
                            rule_id=rule_id,
                            section=section,
                            text=item["text"]
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(f"Section {item['section_number']} - {item['section_title']} not found"))

            # Завантажуємо лише нові записи
            TrafficRule.objects.bulk_create(traffic_rules)

            self.stdout.write(self.style.SUCCESS(
                f"Loaded {len(traffic_rules)} new traffic rules. Skipped {skipped_count} existing.")
            )

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("The file 'data/traffic_rules_data.json' was not found"))
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("Error parsing the JSON file"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred: {str(e)}"))
