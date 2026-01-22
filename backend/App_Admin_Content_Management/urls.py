from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LanguagesViewSet

router = DefaultRouter()
router.register(r'languages', LanguagesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
