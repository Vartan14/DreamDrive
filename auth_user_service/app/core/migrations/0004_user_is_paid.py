# Generated by Django 4.2 on 2025-04-20 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_paid',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
