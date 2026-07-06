from django.db import models

from apps.projects.models import Project, RepositoryFile


class CodeClass(models.Model):
    repository_file = models.ForeignKey(
        RepositoryFile,
        on_delete=models.CASCADE,
        related_name="classes",
    )

    name = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)


class CodeFunction(models.Model):
    repository_file = models.ForeignKey(
        RepositoryFile,
        on_delete=models.CASCADE,
        related_name="functions",
    )

    name = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)


class CodeImport(models.Model):
    repository_file = models.ForeignKey(
        RepositoryFile,
        on_delete=models.CASCADE,
        related_name="imports",
    )

    module = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    
class RepositoryFramework(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="frameworks",
    )

    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("project", "name")

    def __str__(self):
        return self.name
    
class RepositoryMetadata(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="metadata",
    )

    key = models.CharField(max_length=100)
    value = models.CharField(max_length=255)

    class Meta:
        unique_together = ("project", "key")

    def __str__(self):
        return f"{self.key}: {self.value}"
    
class RepositoryDependency(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="dependencies",
    )

    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("project", "name")

    def __str__(self):
        return self.name