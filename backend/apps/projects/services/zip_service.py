from pathlib import Path
from zipfile import ZipFile

from django.conf import settings

from apps.projects.models import Project


def extract_project_zip(project: Project, zip_path: Path):
    extract_path = (
        Path(settings.MEDIA_ROOT)
        / "projects"
        / f"project_{project.id}"
    )

    extract_path.mkdir(parents=True, exist_ok=True)

    with ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_path)

    project.storage_path = str(extract_path)
    project.status = Project.Status.READY
    project.save(update_fields=["storage_path", "status"])

    return extract_path