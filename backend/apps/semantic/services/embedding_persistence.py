from apps.semantic.models import KnowledgeEmbedding


class EmbeddingPersistence:
    def save(
        self,
        *,
        project,
        knowledge_type,
        content,
        embedding_data,
        metadata=None,
    ):
        return KnowledgeEmbedding.objects.create(
            project=project,
            knowledge_type=knowledge_type,
            content=content,
            metadata=metadata or {},
            embedding=embedding_data["embedding"],
            provider=embedding_data["provider"],
            model_name=embedding_data["model_name"],
            dimensions=embedding_data["dimensions"],
        )