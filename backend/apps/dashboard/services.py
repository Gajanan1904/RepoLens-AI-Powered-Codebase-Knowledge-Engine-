from django.db.models import Count
import os

from apps.projects.models import Project, RepositoryFile
from apps.codeintel.models import (
    CodeFunction,
    CodeClass,
    RepositoryFramework,
    RepositoryMetadata,
)


class DashboardService:

    @staticmethod
    def get_dashboard_data(user):
        projects = Project.objects.filter(owner=user)
        summary = {
            "total_repositories": projects.count(),
            "total_files": RepositoryFile.objects.filter(project__owner=user).count(),
            "total_functions": CodeFunction.objects.filter( repository_file__project__owner=user).count(),
            "total_classes": CodeClass.objects.filter(repository_file__project__owner=user).count(),
            "total_frameworks": RepositoryFramework.objects.filter(project__owner=user).values("name").distinct().count(),
            "total_languages": RepositoryFile.objects.filter(project__owner=user).exclude(language="").values("language").distinct().count(),
        }

        recent_repositories = (
            projects.order_by("-created_at")
            .values(
                "id",
                "name",
                "repository_name",
                "status",
                "created_at",
            )[:5]
        )

        processing_status = (
            projects.values("status")
            .annotate(count=Count("id"))
            .order_by()
        )

        language_distribution = (
            RepositoryFile.objects.filter(project__owner=user).exclude(language="")
            .values("language")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        project_type_distribution = (
            RepositoryMetadata.objects.filter(key="project_type", project__owner=user)
            .values("value")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        return {
            "summary": summary,
            "recent_repositories": list(recent_repositories),
            "processing_status": list(processing_status),
            "language_distribution": list(language_distribution),
            "project_type_distribution": list(project_type_distribution),
        }
        
        
from apps.projects.models import Project
from apps.intelligence.services.repository_analyzer import RepositoryAnalyzer

class RepositoryOverviewService:

    @staticmethod
    def get(project_id):
        project = Project.objects.prefetch_related(
            "files",
            "frameworks",
            "dependencies",
            "metadata",
        ).get(id=project_id)

        data = RepositoryAnalyzer.get_repository_overview(project)

        return data
    
    
    
from apps.projects.models import RepositoryFile


class RepositoryExplorerService:
    
    @staticmethod
    def build_tree(node):

    # If this is already a file, return it.
        if isinstance(node, dict) and node.get("type") == "file":
            return node

        result = []

        for name, value in node.items():

            # Folder
            if isinstance(value, dict) and value.get("type") != "file":
                result.append({
                    "name": name,
                    "type": "folder",
                    "children": RepositoryExplorerService.build_tree(value),
                })

            # File
            else:
                result.append(value)

        return result

    @staticmethod
    def get(project_id):

        project = Project.objects.prefetch_related(
            "files",
            "frameworks",
            "dependencies",
            "metadata",
        ).get(id=project_id)

        files = RepositoryFile.objects.select_related(
            "project",
        ).filter(
            project_id=project_id
        ).order_by("path")

        tree = {}

        for file in files:

            parts = file.path.replace("\\", "/").split("/")[2:]

            current = tree

            for folder in parts[:-1]:
                current = current.setdefault(folder, {})

            current[parts[-1]] = {
                "id": file.id,
                "name": file.filename,
                "path": file.path,
                "extension": file.extension,
                "language": file.language,
                "size": file.size,
                "type": "folder" if file.is_directory else "file",
            }

        return {
            "project": project.name,
            "tree":  RepositoryExplorerService.build_tree(tree),
        }
        
class RepositoryInsightsService:

    @staticmethod
    def get(project_id):
        project = Project.objects.prefetch_related(
            "files",
            "frameworks",
            "dependencies",
            "metadata",
        ).get(id=project_id)

        return RepositoryAnalyzer.get_repository_overview(project)
    
class RepositoryFileService:

    @staticmethod
    def get(project_id, file_id):
        file = RepositoryFile.objects.select_related(
            "project",
        ).get(
            id=file_id,
            project_id=project_id,
        )

        content = ""

        if not file.is_directory:
            try:
                
                real_path = os.path.join(
                    Project.objects.get(id=project_id).storage_path,
                    file.path,
                )
                with open(real_path, "r", encoding="utf-8") as f:
                    content = f.read()
            except:
                content = ""

        return {
            "id": file.id,
            "filename": file.filename,
            "path": file.path,
            "language": file.language,
            "extension": file.extension,
            "size": file.size,
            "content": content,
        }