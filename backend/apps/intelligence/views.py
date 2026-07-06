from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import Project
from apps.intelligence.services.repository_analyzer import RepositoryAnalyzer


class RepositoryIntelligenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = Project.objects.get(id=project_id)

        data = RepositoryAnalyzer.build(project)

        return Response(data)