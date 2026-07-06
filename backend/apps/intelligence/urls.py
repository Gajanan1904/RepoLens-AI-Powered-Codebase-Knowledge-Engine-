from django.urls import path

from .views import RepositoryIntelligenceView

urlpatterns = [
    path(
        "<int:project_id>/",
        RepositoryIntelligenceView.as_view(),
        name="repository-intelligence",
    ),
]