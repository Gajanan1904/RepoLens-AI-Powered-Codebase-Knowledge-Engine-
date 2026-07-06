    
from django.urls import path

from apps.semantic.views import SemanticRetrievalAPIView

urlpatterns = [
    path(
        "retrieve/",
        SemanticRetrievalAPIView.as_view(),
        name="semantic-retrieve",
    ),
]