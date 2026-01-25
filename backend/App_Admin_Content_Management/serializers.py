from rest_framework import serializers
from .models import Languages, Timezones

class LanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = ['id', 'language_name', 'language_name_in_native']

class TimezonesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timezones
        fields = ['id', 'timezone_name', 'gmt_offset']
