from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Theme

class UserThemeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        theme_obj, created = Theme.objects.get_or_create(user=request.user)
        return Response({'theme': theme_obj.theme})

    def post(self, request):
        theme_value = request.data.get('theme')
        if theme_value not in ['dark', 'light']:
             return Response({'error': 'Invalid theme value. Must be "dark" or "light".'}, status=400)
        
        theme_obj, created = Theme.objects.get_or_create(user=request.user)
        theme_obj.theme = theme_value
        theme_obj.save()
        return Response({'theme': theme_obj.theme})
