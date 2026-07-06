from django.contrib import admin
from .models import KnowledgeEmbedding


@admin.register(KnowledgeEmbedding)
class KnowledgeEmbeddingAdmin(admin.ModelAdmin):
    list_display = (
        "project",
        "knowledge_type",
        "provider",
        "model_name",
        "created_at",
    )

    search_fields = (
        "project__name",
        "knowledge_type",
    )