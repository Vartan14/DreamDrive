"""
Django command to wait for the database to be available
"""
import time

from psycopg2 import OperationalError as Psycopg2Error

from django.db.utils import OperationalError
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """Django command to wait for database"""

    def handle(self, *args, **options):
        """Entry point for the command"""""

        self.stdout.write('Waiting for database...')

        is_db_up = False
        while is_db_up is False:
            try:
                self.check(databases=['default'])
                is_db_up = True
            except (OperationalError, Psycopg2Error):
                self.stdout.write('Database unavailable, waiting 1 second...')
                time.sleep(1)

        self.stdout.write(self.style.SUCCESS('Database available!'))
