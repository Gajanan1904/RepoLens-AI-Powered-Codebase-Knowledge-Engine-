from django.contrib import admin
from .models import Project, RepositoryFile


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "upload_type",
        "status",
        "created_at",
    )
    list_filter = ("upload_type", "status", "created_at")
    search_fields = ("name", "repository_name", "owner__email")
    ordering = ("-created_at",)


@admin.register(RepositoryFile)
class RepositoryFileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "filename",
        "project",
        "extension",
        "size",
        "is_directory",
    )
    list_filter = ("extension", "is_directory")
    search_fields = ("project__name", "knowledge_type")