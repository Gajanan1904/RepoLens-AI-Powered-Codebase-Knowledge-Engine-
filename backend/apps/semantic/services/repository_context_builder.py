class RepositoryContextBuilder:
    """
    Builds a structured repository context from ranked search results.
    """

    @staticmethod
    def build(project, results):
        context = {
            "repository": project.name,
            "context": [],
        }

        for result in results:
            context["context"].append(
                {
                    "knowledge_type": result.knowledge_type,
                    "content": result.content,
                    "metadata": result.metadata,
                    "distance": round(result.distance, 4),
                }
            )

        return context