from apps.codeintel.models import (CodeClass,CodeFunction,CodeImport,)
from apps.codeintel.models import RepositoryFramework, RepositoryMetadata
from apps.codeintel.models import RepositoryDependency


class PersistenceService:

    @staticmethod
    def save(repository_file, extracted_data):
        # Remove old data
        CodeFunction.objects.filter(repository_file=repository_file).delete()
        CodeClass.objects.filter(repository_file=repository_file).delete()
        CodeImport.objects.filter(repository_file=repository_file).delete()

        # Save Functions
        CodeFunction.objects.bulk_create([
            CodeFunction(
                repository_file=repository_file,
                name=name,
            )
            for name in extracted_data["functions"]
        ])

        # Save Classes
        CodeClass.objects.bulk_create([
            CodeClass(
                repository_file=repository_file,
                name=name,
            )
            for name in extracted_data["classes"]
        ])

        # Save Imports
        CodeImport.objects.bulk_create([
            CodeImport(
                repository_file=repository_file,
                module=name,
            )
            for name in extracted_data["imports"]
        ])
        
    @staticmethod
    def save_frameworks(project, frameworks):
        RepositoryFramework.objects.filter(project=project).delete()

        RepositoryFramework.objects.bulk_create([
            RepositoryFramework(
                project=project,
                name=framework,
            )
            for framework in frameworks
        ])
        
    @staticmethod
    def save_metadata(project, metadata):
        RepositoryMetadata.objects.filter(project=project).delete()

        RepositoryMetadata.objects.bulk_create([
            RepositoryMetadata(
                project=project,
                key=item["key"],
                value=item["value"],
            )
            for item in metadata
        ])
        
    @staticmethod
    def save_dependencies(project, dependencies):
        RepositoryDependency.objects.filter(project=project).delete()

        RepositoryDependency.objects.bulk_create([
            RepositoryDependency(
                project=project,
                name=dependency,
            )
            for dependency in dependencies
        ])