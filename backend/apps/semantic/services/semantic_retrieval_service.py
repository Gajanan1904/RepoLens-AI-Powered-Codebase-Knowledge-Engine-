from apps.semantic.services.query_embedding_service import QueryEmbeddingService
from apps.semantic.services.vector_search_service import VectorSearchService
from apps.semantic.services.repository_context_builder import RepositoryContextBuilder


class SemanticRetrievalService:

    @staticmethod
    def retrieve(project, question, top_k=5):
        query_embedding = QueryEmbeddingService.generate(question)

        results = VectorSearchService.search(
            project=project,
            query_embedding=query_embedding,
            top_k=top_k,
        )

        return RepositoryContextBuilder.build(project, results)

    @staticmethod
    def get_prompt_context(project, question, top_k=5):
        retrieval_result = SemanticRetrievalService.retrieve(
            project=project,
            question=question,
            top_k=top_k,
        )

        context_chunks = retrieval_result.get("context", [])

        return "\n\n".join(
            chunk["content"]
            for chunk in context_chunks
            if chunk.get("content")
        )