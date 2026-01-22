from rest_framework import viewsets
from .models import Languages
from .serializers import LanguagesSerializer

class LanguagesViewSet(viewsets.ModelViewSet):
    queryset = Languages.objects.all().order_by('language_name')
    serializer_class = LanguagesSerializer
