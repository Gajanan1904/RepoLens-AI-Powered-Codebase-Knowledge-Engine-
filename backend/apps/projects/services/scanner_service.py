
from pathlib import Path

from apps.projects.models import Project, RepositoryFile

from apps.intelligence.services.language_detector import LanguageDetector

from apps.intelligence.parsers.registry import ParserRegistry
from apps.codeintel.services.persistence_service import PersistenceService
from apps.intelligence.services.framework_detector import FrameworkDetector
from apps.intelligence.services.metadata_detector import MetadataDetector
from apps.intelligence.services.dependency_detector import DependencyDetector
from apps.repository_filtering.services import RepositoryFilteringService


def scan_repository(project: Project):
    root = Path(project.storage_path)
    filtering_service = RepositoryFilteringService(root)

    RepositoryFile.objects.filter(project=project).delete()

    files = []

    for current_root, dirs, filenames in root.walk():
        current_root = Path(current_root)

        filtered_dirs = []

        for directory in dirs:
            directory_path = (current_root / directory).relative_to(root)

            if filtering_service.should_include(directory_path):
                filtered_dirs.append(directory)

        dirs[:] = filtered_dirs

        for filename in filenames:
            file_path = current_root / filename

            relative_path = file_path.relative_to(root)

            if not filtering_service.should_include(relative_path):
                continue
            
            language = LanguageDetector.detect(str(relative_path))

            files.append(
                RepositoryFile(
                    project=project,
                    path=str(relative_path),
                    filename=file_path.name,
                    extension=file_path.suffix,
                    size=file_path.stat().st_size,
                    is_directory=False,
                    language=language,
                )
            )

    saved_files = RepositoryFile.objects.bulk_create(files)
    
    for repository_file in saved_files:
        if not repository_file.language:
            continue

        parser = ParserRegistry.get_parser(repository_file.language)

        if parser is None:
            continue

        try:
            extracted_data = parser.parse(str(root / repository_file.path))

            PersistenceService.save(
                repository_file=repository_file,
                extracted_data=extracted_data,
            )
        except Exception:
            continue

    frameworks = FrameworkDetector.detect_repository(root)
    PersistenceService.save_frameworks(project, frameworks)

    metadata = MetadataDetector.detect(root)
    PersistenceService.save_metadata(project, metadata)
    
    dependencies = DependencyDetector.detect(root)
    PersistenceService.save_dependencies(project, dependencies)

    from apps.intelligence.services.repository_analyzer import RepositoryAnalyzer
    RepositoryAnalyzer.build(project)

    project.status = Project.Status.READY
    project.save(update_fields=["status"])

    return len(files)