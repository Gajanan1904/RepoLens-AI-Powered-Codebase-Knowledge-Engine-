from apps.semantic.providers.sentence_transformer import (
    SentenceTransformerProvider,
)


class EmbeddingGenerator:
    def __init__(self, provider=None):
        self.provider = provider or SentenceTransformerProvider()

    def generate(self, text: str):
        return {
            "embedding": self.provider.generate_embedding(text),
            "provider": self.provider.provider_name,
            "model_name": self.provider.model_name,
            "dimensions": self.provider.dimensions,
        }