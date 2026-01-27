from rest_framework import viewsets
from .models import Languages, Timezones, Subject_Tag
from .serializers import LanguagesSerializer, TimezonesSerializer, SubjectTagSerializer

class LanguagesViewSet(viewsets.ModelViewSet):
    queryset = Languages.objects.all().order_by('language_name')
    serializer_class = LanguagesSerializer

class TimezonesViewSet(viewsets.ModelViewSet):
    queryset = Timezones.objects.all().order_by('timezone_name')
    serializer_class = TimezonesSerializer

class SubjectTagViewSet(viewsets.ModelViewSet):
    queryset = Subject_Tag.objects.all().order_by('name')
    serializer_class = SubjectTagSerializer

    def perform_create(self, serializer):
        # Auto-generate slug from name if not provided
        name = serializer.validated_data.get('name')
        from django.utils.text import slugify
        slug = slugify(name)
        serializer.save(slug=slug)

    def perform_update(self, serializer):
        # Update slug if name changes
        if 'name' in serializer.validated_data:
            name = serializer.validated_data.get('name')
            from django.utils.text import slugify
            serializer.save(slug=slugify(name))
        else:
            serializer.save()

