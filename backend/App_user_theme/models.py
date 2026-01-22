from django.db import models
import uuid
from django.conf import settings

class Theme(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='theme_preference')
    theme = models.CharField(max_length=10, choices=[('dark', 'Dark'), ('light', 'Light')], default='light')

    def __str__(self):
        return f"{self.user.email} - {self.theme}"
