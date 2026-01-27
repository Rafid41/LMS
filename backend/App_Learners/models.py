from django.db import models
from django.contrib.auth import get_user_model
from App_Admin_Content_Management.models import Subject_Tag
import uuid

User = get_user_model()

class LearnerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learner_profile')

    # Learning Preferences
    interests = models.ManyToManyField(Subject_Tag, blank=True)

    # Gamification Global Stats
    total_xp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    badges = models.JSONField(default=list)  # ["first_login", "course_complete"]

    # Engagement Metrics
    streak_days = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_active = models.DateTimeField(auto_now=True)

    # Learning Stats
    total_courses_enrolled = models.PositiveIntegerField(default=0)
    total_courses_completed = models.PositiveIntegerField(default=0)
    total_quizzes_attempted = models.PositiveIntegerField(default=0)
    total_quizzes_passed = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Learner Profile"
