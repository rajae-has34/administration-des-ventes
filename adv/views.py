from pathlib import Path
from django.views import View
from django.http import HttpResponse

class FrontendAppView(View):
    def get(self, request):
        # Chemin vers le build React
        index_path = Path(__file__).resolve().parent.parent / 'frontend' / 'build' / 'index.html'

        if index_path.exists():
            with open(index_path, 'r', encoding='utf-8') as f:
                return HttpResponse(f.read())
        return HttpResponse(f"React build non trouvé ! Chemin recherché: {index_path}", status=404)
from django.contrib.auth.models import User
from rest_framework import viewsets
from .serializers import UserSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint pour voir les utilisateurs Django
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer