from rest_framework import serializers
from .models import LearnerProfile
from App_Admin_Content_Management.serializers import SubjectTagSerializer

class LearnerProfileSerializer(serializers.ModelSerializer):
    # Retrieve full interest objects (read) or accept IDs (write)
    interests = SubjectTagSerializer(many=True, read_only=True)
    interest_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = LearnerProfile
        fields = [
            'id', 'interests', 'interest_ids', 'total_xp', 'level', 'badges',
            'streak_days', 'longest_streak', 'last_active',
            'total_courses_enrolled', 'total_courses_completed',
            'total_quizzes_attempted', 'total_quizzes_passed',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'total_xp', 'level', 'badges',
            'streak_days', 'longest_streak', 'last_active',
            'total_courses_enrolled', 'total_courses_completed',
            'total_quizzes_attempted', 'total_quizzes_passed',
            'created_at', 'updated_at'
        ]

    def update(self, instance, validated_data):
        interest_ids = validated_data.pop('interest_ids', None)
        if interest_ids is not None:
             instance.interests.set(interest_ids)
        return super().update(instance, validated_data)
