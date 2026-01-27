from django.urls import path
from .views import InstructorProfileView

urlpatterns = [
    path('profile/', InstructorProfileView.as_view(), name='instructor-profile'),
]
