from django.conf import settings

from .gemini_provider import GeminiProvider


class ProviderRegistry:
    PROVIDERS = {
        "gemini": GeminiProvider,
    }

    @classmethod
    def get_provider(cls):
        provider_name = settings.AI_PROVIDER.lower()

        provider_class = cls.PROVIDERS.get(provider_name)

        if provider_class is None:
            raise ValueError(f"Unsupported AI provider: {provider_name}")

        return provider_class()