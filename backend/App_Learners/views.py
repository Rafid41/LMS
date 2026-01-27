from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import LearnerProfile
from .serializers import LearnerProfileSerializer

class LearnerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = LearnerProfile.objects.get_or_create(user=request.user)
        serializer = LearnerProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = LearnerProfile.objects.get_or_create(user=request.user)
        serializer = LearnerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
