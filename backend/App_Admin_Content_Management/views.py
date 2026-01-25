from rest_framework import viewsets
from .models import Languages, Timezones
from .serializers import LanguagesSerializer, TimezonesSerializer

class LanguagesViewSet(viewsets.ModelViewSet):
    queryset = Languages.objects.all().order_by('language_name')
    serializer_class = LanguagesSerializer

class TimezonesViewSet(viewsets.ModelViewSet):
    queryset = Timezones.objects.all().order_by('timezone_name')
    serializer_class = TimezonesSerializer
