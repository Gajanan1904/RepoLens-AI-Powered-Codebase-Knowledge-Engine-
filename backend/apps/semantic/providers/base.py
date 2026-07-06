from abc import ABC, abstractmethod


class BaseEmbeddingProvider(ABC):
    @abstractmethod
    def generate_embedding(self, text: str) -> list[float]:
        pass

    @property
    @abstractmethod
    def dimensions(self) -> int:
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        pass