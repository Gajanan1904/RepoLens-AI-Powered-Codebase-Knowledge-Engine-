from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import Project
from apps.semantic.serializers import SemanticRetrievalSerializer
from apps.semantic.services.semantic_retrieval_service import SemanticRetrievalService
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404

@extend_schema(
    request=SemanticRetrievalSerializer,
    responses={200: dict},
)


class SemanticRetrievalAPIView(APIView):

    def post(self, request):
        serializer = SemanticRetrievalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project = get_object_or_404(
            Project,
            id=serializer.validated_data["project_id"],
)

        context = SemanticRetrievalService.retrieve(
            project=project,
            question=serializer.validated_data["question"],
            top_k=serializer.validated_data["top_k"],
        )

        return Response(context, status=status.HTTP_200_OK)