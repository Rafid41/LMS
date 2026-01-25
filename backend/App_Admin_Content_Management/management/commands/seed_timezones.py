from django.core.management.base import BaseCommand
from App_Admin_Content_Management.models import Timezones
from django.db import transaction
import pytz
from datetime import datetime

class Command(BaseCommand):
    help = 'Seeds the database with all world timezones'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding timezones...')
        
        all_timezones = pytz.all_timezones
        created_count = 0
        skipped_count = 0
        
        with transaction.atomic():
            for tz_name in all_timezones:
                try:
                    # Get current offset
                    tz = pytz.timezone(tz_name)
                    now = datetime.now(tz)
                    offset = now.strftime('%z') # e.g. +0600 or -0500
                    
                    # Format to +06:00
                    formatted_offset = f"{offset[:-2]}:{offset[-2:]}"
                    
                    # Create or get
                    obj, created = Timezones.objects.get_or_create(
                        timezone_name=tz_name,
                        defaults={'gmt_offset': formatted_offset}
                    )
                    
                    if created:
                        created_count += 1
                        # self.stdout.write(f'Created: {tz_name} ({formatted_offset})')
                    else:
                        skipped_count += 1
                        # Update offset if changed (e.g. DST)
                        if obj.gmt_offset != formatted_offset:
                            obj.gmt_offset = formatted_offset
                            obj.save()
                            # self.stdout.write(f'Updated offset: {tz_name}')
                            
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f'Error processing {tz_name}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully processed timezones.'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count}'))
        self.stdout.write(self.style.WARNING(f'Skipped/Updated: {skipped_count}'))
