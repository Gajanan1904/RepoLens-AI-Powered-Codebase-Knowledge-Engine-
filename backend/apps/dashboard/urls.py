from django.urls import path

from .views import DashboardAPIView, RepositoryFileAPIView, RepositoryInsightsAPIView, RepositoryOverviewAPIView,RepositoryExplorerAPIView

urlpatterns = [
    path("", DashboardAPIView.as_view(), name="dashboard"),
    path("projects/<int:project_id>/overview/", RepositoryOverviewAPIView.as_view(), name="repository-overview"),
    path("projects/<int:project_id>/explorer/",RepositoryExplorerAPIView.as_view(),name="repository-explorer",),
    path("projects/<int:project_id>/insights/",RepositoryInsightsAPIView.as_view(),name="repository-insights",),
    path("projects/<int:project_id>/files/<int:file_id>/",RepositoryFileAPIView.as_view(),name="repository-file",),
    
]