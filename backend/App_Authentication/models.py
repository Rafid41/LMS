import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import gettext_lazy as _
from nanoid import generate

def generate_nanoid():
    return generate(size=10)

class TemporaryRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128) # Store hashed password
    user_type = models.CharField(max_length=10) # 'student' or 'teacher'
    otp = models.CharField(max_length=6)
    otp_created_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Temp Reg: {self.email}"

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=10, unique=True, default=generate_nanoid)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

from .utils import rename_profile_picture, process_profile_picture

class CommonProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='common_profile')

    # Public Identity
    full_name = models.CharField(max_length=120)
    profile_photo = models.ImageField(
        upload_to=rename_profile_picture, 
        default='profile_picture/default_profile_picture.png',
        null=True, 
        blank=True
    )

    # Personal Info
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[('male','Male'),('female','Female')],
    )
    # Address stored as JSON: { country, state, city, street_address }
    Address = models.JSONField(null=True, blank=True)

    # Platform Settings
    timezone = models.CharField(max_length=50, default='Asia/Dhaka') 

    # Status & Control
    is_blocked = models.BooleanField(default=False)

    # System
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Social / Web
    email_for_communication = models.EmailField(blank=True, null=True)
    website = models.URLField(null=True, blank=True)
    linkedin = models.URLField(null=True, blank=True)
    github = models.URLField(null=True, blank=True)
    facebook = models.URLField(null=True, blank=True)
    whatsApp = models.CharField(max_length=20, null=True, blank=True)
    twitter_X = models.URLField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Check if this is a new upload or an update
        if self.pk:
            try:
                old_profile = CommonProfile.objects.get(pk=self.pk)
                if old_profile.profile_photo != self.profile_photo and self.profile_photo:
                    # New image uploaded, process it
                    # We check if it's not the default image to avoid processing that
                    if 'default_profile_picture.png' not in self.profile_photo.name:
                        self.profile_photo = process_profile_picture(self.profile_photo)
            except CommonProfile.DoesNotExist:
                pass # Should be new instance case logic below
        
        # If it's a new instance and has a photo that isn't default
        if not self.pk and self.profile_photo and 'default_profile_picture.png' not in self.profile_photo.name:
             self.profile_photo = process_profile_picture(self.profile_photo)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

class UserType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_type')
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)

    def __str__(self):
        return f"{self.user.email} - {self.user_type}"
