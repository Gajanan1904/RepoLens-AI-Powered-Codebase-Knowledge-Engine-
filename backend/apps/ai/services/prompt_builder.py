class PromptBuilder:
    """
    Builds provider-independent prompts for the AI model.
    """

    SYSTEM_INSTRUCTIONS = """
You are RepoLens, an AI assistant that explains software repositories.

Rules:
1. Answer ONLY using the provided repository context.
2. Do NOT invent files, classes, functions, or behavior.
3. If the context is insufficient, clearly say so.
4. Keep answers accurate and concise.
5. Mention file names or components when relevant.
""".strip()

    @classmethod
    def build(cls, question: str, repository_context: str) -> str:
        return f"""
{cls.SYSTEM_INSTRUCTIONS}

Repository Context:
-------------------
{repository_context}

User Question:
--------------
{question}

Answer:
""".strip()