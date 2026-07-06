from django.conf import settings
from django.db import models
from apps.intelligence.services.language_detector import LanguageDetector


class Project(models.Model):
    class UploadType(models.TextChoices):
        ZIP = "ZIP", "ZIP"
        GITHUB = "GITHUB", "GitHub"

    class Status(models.TextChoices):
        UPLOADING = "UPLOADING", "Uploading"
        EXTRACTING = "EXTRACTING", "Extracting"
        READY = "READY", "Ready"
        FAILED = "FAILED", "Failed"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects",
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    upload_type = models.CharField(
        max_length=20,
        choices=UploadType.choices,
        default=UploadType.ZIP,
    )
    repository_name = models.CharField(max_length=255)
    storage_path = models.CharField(max_length=500)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UPLOADING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class RepositoryFile(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="files",
    )
    path = models.TextField()
    filename = models.CharField(max_length=255)
    extension = models.CharField(max_length=20, blank=True)
    size = models.BigIntegerField(default=0)
    is_directory = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    language = models.CharField(max_length=50, blank=True, default="")

    def __str__(self):
        return self.path
    
    zip_file = models.FileField(
    upload_to="uploads/",
    null=True,
    blank=True,
)