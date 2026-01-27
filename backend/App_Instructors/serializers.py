from rest_framework import serializers
from .models import InstructorProfile

class InstructorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorProfile
        fields = [
            'designation', 'short_bio', 'full_bio', 
            'teaching_languages', 'organization', 'years_of_experience',
            'total_courses', 'total_students', 'average_rating',
            'is_approved', 'verified_badge'
        ]
        read_only_fields = [
            'total_courses', 'total_students', 'average_rating',
            'is_approved', 'verified_badge'
        ]
