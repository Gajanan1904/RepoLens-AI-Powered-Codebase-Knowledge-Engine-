from itertools import count

from tree_sitter_python import language

from apps.projects.models import RepositoryFile
from django.db.models import Sum
from .repository_knowledge_builder import RepositoryKnowledgeBuilder
from apps.codeintel.services.project_type_detector import ProjectTypeDetector
from apps.codeintel.services.entry_point_detector import EntryPointDetector
from django.db.models import Count
from apps.codeintel.models import (
    CodeFunction,
    CodeClass,
    CodeImport,
    RepositoryFramework,
    RepositoryMetadata,
    RepositoryDependency,
)


class RepositoryAnalyzer:
    
    @staticmethod
    def get_repository_overview(project):
        languages = list(
            RepositoryFile.objects.filter(project=project)
            .exclude(language__isnull=True)
            .values_list("language", flat=True)
            .distinct()
        )

        frameworks = list(
            RepositoryFramework.objects.filter(project=project)
            .values_list("name", flat=True)
        )

        metadata = list(
            RepositoryMetadata.objects.filter(project=project)
            .values("key", "value")
        )
        
        project_type = ProjectTypeDetector.detect(frameworks, metadata)
        
        
        dependencies = list(
            RepositoryDependency.objects.filter(project=project)
            .values_list("name", flat=True)
        )
        
        entry_points = EntryPointDetector.detect(project.storage_path)
        

        statistics = {
            "files": RepositoryFile.objects.filter(project=project).count(),

            "python_files": RepositoryFile.objects.filter(project=project,language="Python").count(),

            "javascript_files": RepositoryFile.objects.filter(project=project,language="JavaScript").count(),

            "html_files": RepositoryFile.objects.filter(project=project,language="HTML").count(),

            "css_files": RepositoryFile.objects.filter(project=project,language="CSS").count(),

            "functions": CodeFunction.objects.filter(repository_file__project=project).count(),

            "classes": CodeClass.objects.filter(repository_file__project=project).count(),

            "imports": CodeImport.objects.filter(repository_file__project=project).count(),
            
            "dependencies": RepositoryDependency.objects.filter(project=project).count(),

            "frameworks": RepositoryFramework.objects.filter(project=project).count(),

            "metadata": RepositoryMetadata.objects.filter(project=project).count(),
            
            "total_size_bytes": RepositoryFile.objects.filter(project=project).aggregate(total=Sum("size"))["total"] or 0,
            
            "largest_file": RepositoryFile.objects.filter(project=project).order_by("-size").values("path", "size").first(),
            
            "average_file_size_bytes": round((RepositoryFile.objects.filter(project=project).aggregate(total=Sum("size"))["total"] or 0) / max(RepositoryFile.objects.filter(project=project).count(),1,),2,),
            
            "extension_stats": {row["extension"]: row["count"]
                               for row in RepositoryFile.objects.filter(project=project).
                               exclude(extension="")
                               .values("extension")
                               .annotate(count=Count("id"))
                               },
            
            "language_distribution": {
                                row["language"]: row["count"]
                                for row in RepositoryFile.objects.filter(project=project).
                                exclude(language="")
                                .values("language")
                                .annotate(count=Count("id"))
                                },
            
            "source_files": RepositoryFile.objects.filter(project=project,is_directory=False).count(),
            

            
            "avg_functions_per_file": round(CodeFunction.objects.filter(repository_file__project=project).count() /max(RepositoryFile.objects.filter(project=project,is_directory=False).count(),1,),2,),
        }

        knowledge = RepositoryKnowledgeBuilder.build(
            project=project,
            languages=languages,
            frameworks=frameworks,
            dependencies=dependencies,
            metadata=metadata,
            project_type=project_type,
            entry_points=entry_points,
            statistics=statistics,
        )
        
        return knowledge

    @staticmethod
    def build(project):
        knowledge = RepositoryAnalyzer.get_repository_overview(project)
        knowledge_items = [
            {
                "knowledge_type": "SUMMARY",
                "content": str(knowledge["identity"]),
                "metadata": {"section": "identity"},
            },
            {
                "knowledge_type": "LANGUAGES",
                "content": ", ".join(knowledge["languages"]),
                "metadata": {"section": "languages"},
            },
            {
                "knowledge_type": "FRAMEWORKS",
                "content": ", ".join(knowledge["frameworks"]),
                "metadata": {"section": "frameworks"},
            },
            {
                "knowledge_type": "DEPENDENCIES",
                "content": ", ".join(knowledge["dependencies"]),
                "metadata": {"section": "dependencies"},
            },
            {
                "knowledge_type": "ENTRY_POINTS",
                "content": str(knowledge["entry_points"]),
                "metadata": {"section": "entry_points"},
            },
            {
                "knowledge_type": "STATISTICS",
                "content": str(knowledge["statistics"]),
                "metadata": {"section": "statistics"},
            },
        ]

        from apps.semantic.services.embedding_pipeline import EmbeddingPipeline

        EmbeddingPipeline().process(project, knowledge_items)

        return knowledge