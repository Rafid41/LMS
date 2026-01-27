from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LanguagesViewSet, TimezonesViewSet, SubjectTagViewSet

router = DefaultRouter()
router.register(r'languages', LanguagesViewSet)
router.register(r'timezones', TimezonesViewSet)
router.register(r'subject-tags', SubjectTagViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
