from django.db import models
from pgvector.django import VectorField

from apps.projects.models import Project


class KnowledgeEmbedding(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="embeddings",
    )

    knowledge_type = models.CharField(max_length=50)

    content = models.TextField()

    metadata = models.JSONField(default=dict)

    embedding = VectorField(dimensions=384)

    provider = models.CharField(max_length=100)

    model_name = models.CharField(max_length=100)

    dimensions = models.PositiveIntegerField(default=384)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "knowledge_embeddings"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.project.name} - {self.knowledge_type}"