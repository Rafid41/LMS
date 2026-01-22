from django.urls import path
from .views import UserThemeView

urlpatterns = [
    path('api/theme/', UserThemeView.as_view(), name='user-theme'),
]
