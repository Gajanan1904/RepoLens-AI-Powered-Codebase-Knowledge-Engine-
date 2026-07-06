from apps.ai.gateway.ai_gateway import AIGateway
from apps.ai.services.prompt_builder import PromptBuilder
from apps.ai.services.response_validator import ResponseValidator
from apps.semantic.services.semantic_retrieval_service import (
    SemanticRetrievalService,
)
from django.conf import settings


class AIReasoningService:

    def __init__(self):
        self.gateway = AIGateway()

    def answer(self, project, question: str):

        if not question.strip():
            raise ValueError("Question cannot be empty.")

        repository_context = SemanticRetrievalService.get_prompt_context(
            project=project,
            question=question,
            top_k=settings.AI_TOP_K,
        )
            

        if not repository_context.strip():
            raise ValueError("Repository context cannot be empty.")
        
        
        prompt = PromptBuilder.build(
            question=question,
            repository_context=repository_context,
        )

        response = self.gateway.generate(prompt)

        return ResponseValidator.validate(response)