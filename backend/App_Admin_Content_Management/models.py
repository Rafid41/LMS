from django.db import models
import uuid

class Languages(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    language_name = models.CharField(max_length=100)
    language_name_in_native = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.language_name} ({self.language_name_in_native})"
    
    class Meta:
        verbose_name_plural = "Languages"

class Timezones(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timezone_name = models.CharField(max_length=100) # e.g. "Asia/Dhaka"
    gmt_offset = models.CharField(max_length=20) # e.g. "+06:00"

    def __str__(self):
        return f"{self.timezone_name} ({self.gmt_offset})"
    
    class Meta:
        verbose_name_plural = "Timezones"
