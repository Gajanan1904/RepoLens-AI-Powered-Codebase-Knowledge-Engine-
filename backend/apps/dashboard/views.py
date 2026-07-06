from rest_framework.views import APIView
from rest_framework.response import Response
from .services import (
    DashboardService,
    RepositoryOverviewService,
    RepositoryExplorerService,
    RepositoryInsightsService,
    RepositoryFileService,
)

from .services import DashboardService
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated


class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Dashboard",
        description="Returns complete dashboard data."
    )
    def get(self, request):
        return Response(DashboardService.get_dashboard_data(request.user))
    
    
class RepositoryOverviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Repository Overview",
        description="Returns repository overview."
    )
    def get(self, request, project_id):
        data = RepositoryOverviewService.get(project_id)
        return Response(data)
    
class RepositoryExplorerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Repository Explorer",
        description="Returns repository explorer data."
    )
    def get(self, request, project_id):
        data = RepositoryExplorerService.get(project_id)
        return Response(data)
    
class RepositoryInsightsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Repository Insights",
        description="Returns repository insights data."
    )
    def get(self, request, project_id):
        return Response(
            RepositoryInsightsService.get(project_id)
        )
        
class RepositoryFileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Repository File",
        description="Returns file content."
    )
    def get(self, request, project_id, file_id):
        return Response(
            RepositoryFileService.get(project_id, file_id)
        )