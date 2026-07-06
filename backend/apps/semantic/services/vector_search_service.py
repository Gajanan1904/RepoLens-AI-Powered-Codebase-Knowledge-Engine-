from pgvector.django import CosineDistance

from apps.semantic.models import KnowledgeEmbedding
from apps.semantic.services.ranking_service import RankingService


class VectorSearchService:

    @staticmethod
    def search(project, query_embedding, top_k=5):
        results = (
            KnowledgeEmbedding.objects
            .filter(project=project)
            .annotate(
                distance=CosineDistance(
                "embedding",
                query_embedding["embedding"],
                )
            )
            .order_by("distance")[:top_k]
)

        return RankingService.rank(results)