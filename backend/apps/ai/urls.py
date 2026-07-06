from django.urls import path

from apps.ai.views import AIChatAPIView

urlpatterns = [
    path("chat/", AIChatAPIView.as_view(), name="ai-chat"),
]