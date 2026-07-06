from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.services.reasoning_service import AIReasoningService
from apps.projects.models import Project
from drf_spectacular.utils import extend_schema

from apps.ai.serializers import (
    AIChatSerializer,
    AIChatResponseSerializer,
)
from django.shortcuts import get_object_or_404


class AIChatAPIView(APIView):
    
    reasoning_service = AIReasoningService()
    
    @extend_schema(
        request=AIChatSerializer,
        responses={200: AIChatResponseSerializer},
)

    def post(self, request):

        serializer = AIChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project = get_object_or_404(
            Project,
            id=serializer.validated_data["project_id"],
        )

        try:
            response = self.reasoning_service.answer(
                project=project,
                question=serializer.validated_data["question"],
            )

            return Response(
                {
                    "success": response.success,
                    "provider": response.provider,
                    "answer": response.content,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {
                    "success": False,
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )