from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from App_Authentication.models import UserType

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with an admin user'

    def handle(self, *args, **options):
        email = 'gsb00567@gmail.com'
        password = 'Abc@12345'

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User {email} already exists'))
            return

        # Create Superuser
        user = User.objects.create_superuser(
            email=email,
            password=password
        )
        
        # Create UserType entry
        UserType.objects.create(user=user, user_type='admin')

        self.stdout.write(self.style.SUCCESS(f'Successfully created admin user: {email}'))
