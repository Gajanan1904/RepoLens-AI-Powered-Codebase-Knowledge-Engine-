from apps.ai.providers.base import AIResponse
from apps.ai.providers.registry import ProviderRegistry


class AIGateway:

    def __init__(self):
        self.provider = ProviderRegistry.get_provider()

    def generate(self, prompt: str) -> AIResponse:
        return self.provider.generate(prompt)