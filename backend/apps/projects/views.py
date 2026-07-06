from rest_framework import generics, permissions
from .models import Project
from .serializers import ProjectSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from .upload_serializers import ProjectUploadSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema
from apps.projects.services.upload_service import process_uploaded_repository

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)
    
class ProjectUploadView(generics.GenericAPIView):
    
    serializer_class = ProjectUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(
        request=ProjectUploadSerializer,
        responses={200: None},
    )
    def post(self, request, pk):
        print("=== Upload request received ===")
        project = get_object_or_404(
            Project,
            pk=pk,
            owner=request.user,
        )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uploaded_file = serializer.validated_data["zip_file"]

        process_uploaded_repository(project, uploaded_file)

        return Response(
        {
            "message": "ZIP uploaded and repository processed successfully.",
            "status": project.status,
        },
        status=status.HTTP_200_OK,
)