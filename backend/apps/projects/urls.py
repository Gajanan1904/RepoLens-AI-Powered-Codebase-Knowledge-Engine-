from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, ProjectUploadView


urlpatterns = [
    path("", ProjectListCreateView.as_view(), name="project-list-create"),
    path("<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("<int:pk>/upload/", ProjectUploadView.as_view(), name="project-upload"),
]
