from apps.semantic.services.embedding_generator import EmbeddingGenerator


class QueryEmbeddingService:
    """
    Generates an embedding vector for a user's query.
    """

    @staticmethod
    def generate(query: str):
        return EmbeddingGenerator().generate(query)