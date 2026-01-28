from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class InstructorProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='instructor_profile')

    # Professional Identity
    designation = models.CharField(max_length=120, null=True, blank=True)  # Senior Dev, Lecturer, etc
    short_bio = models.CharField(max_length=300, null=True, blank=True)
    full_bio = models.TextField(null=True, blank=True)

    teaching_languages = models.JSONField(default=list)  # ["English", "Bangla"]

    # Organization
    organization = models.CharField(max_length=150)
    years_of_experience = models.FloatField(default=0)

    # Teaching Stats (auto calculated)
    total_courses = models.PositiveIntegerField(default=0)
    total_students = models.PositiveIntegerField(default=0)
    average_rating = models.FloatField(default=0)

    # Admin Control
    is_approved = models.BooleanField(default=False)
    verified_badge = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Instructor Profile"
