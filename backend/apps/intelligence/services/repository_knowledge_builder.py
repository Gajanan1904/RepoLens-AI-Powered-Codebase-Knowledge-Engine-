class RepositoryKnowledgeBuilder:

    @classmethod
    def build(
        cls,
        project,
        languages,
        frameworks,
        dependencies,
        metadata,
        project_type,
        entry_points,
        statistics,
    ):
        return {
            "identity": {
                "name": project.name,
                "repository": project.repository_name,
                "type": project_type.get("type", "Unknown"),
            },
            "languages": languages,
            "frameworks": frameworks,
            "dependencies": dependencies,
            "metadata": metadata,
            "entry_points": entry_points,
            "statistics": statistics,
        }