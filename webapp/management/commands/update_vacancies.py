from django.core.management.base import BaseCommand
from webapp.lib.vacancies import process_feed


class Command(BaseCommand):
    help = 'Fetches, processes and updates vacancies'

    def handle(self, *args, **options):
        self.stdout.write("Updating vacancies...")
        process_feed()
        self.stdout.write("Done!")
