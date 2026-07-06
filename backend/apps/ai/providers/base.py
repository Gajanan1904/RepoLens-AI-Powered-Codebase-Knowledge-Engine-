from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class AIResponse:
    content: str
    provider: str
    success: bool = True


class BaseAIProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str) -> AIResponse:
        """Generate an AI response."""
        pass