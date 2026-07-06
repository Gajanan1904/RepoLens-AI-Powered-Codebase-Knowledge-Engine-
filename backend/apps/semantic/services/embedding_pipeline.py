from apps.semantic.services.embedding_generator import EmbeddingGenerator
from apps.semantic.services.embedding_persistence import EmbeddingPersistence


class EmbeddingPipeline:
    def __init__(self):
        self.generator = EmbeddingGenerator()
        self.persistence = EmbeddingPersistence()

    def process(self, project, knowledge_items):
        """
        knowledge_items = [
            {
                "knowledge_type": "...",
                "content": "...",
                "metadata": {...}
            }
        ]
        """

        from apps.semantic.models import KnowledgeEmbedding

        # Remove old embeddings before creating new ones
        KnowledgeEmbedding.objects.filter(project=project).delete()

        for item in knowledge_items:
            embedding = self.generator.generate(item["content"])

            self.persistence.save(
                project=project,
                knowledge_type=item["knowledge_type"],
                content=item["content"],
                metadata=item.get("metadata", {}),
                embedding_data=embedding,
            )