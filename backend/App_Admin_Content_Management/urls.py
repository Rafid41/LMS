from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LanguagesViewSet, TimezonesViewSet

router = DefaultRouter()
router.register(r'languages', LanguagesViewSet)
router.register(r'timezones', TimezonesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
