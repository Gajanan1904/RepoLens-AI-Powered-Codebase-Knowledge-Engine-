from apps.ai.providers.base import AIResponse


class ResponseValidator:

    @staticmethod
    def validate(response: AIResponse) -> AIResponse:

        if not response.success:
            return AIResponse(
                content="Failed to generate AI response.",
                provider=response.provider,
                success=False,
            )

        if not response.content.strip():
            return AIResponse(
                content="AI returned an empty response.",
                provider=response.provider,
                success=False,
            )

        return response