from django.conf import settings
from google import genai

from .base import BaseAIProvider, AIResponse


class GeminiProvider(BaseAIProvider):

    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate(self, prompt: str) -> AIResponse:
        try:
            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
            )

            return AIResponse(
                content=response.text.strip(),
                provider="gemini",
                success=True,
            )

        except Exception as e:
            return AIResponse(
                content=str(e),
                provider="gemini",
                success=False,
            )