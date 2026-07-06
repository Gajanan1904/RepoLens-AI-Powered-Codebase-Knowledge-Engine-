from sentence_transformers import SentenceTransformer

from .base import BaseEmbeddingProvider


class SentenceTransformerProvider(BaseEmbeddingProvider):
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def generate_embedding(self, text: str) -> list[float]:
        return self.model.encode(text).tolist()

    @property
    def dimensions(self) -> int:
        return 384

    @property
    def provider_name(self) -> str:
        return "sentence-transformers"

    @property
    def model_name(self) -> str:
        return "all-MiniLM-L6-v2"