from pathlib import Path

from django.conf import settings

from apps.projects.models import Project
from apps.projects.services.zip_service import extract_project_zip
from apps.projects.services.scanner_service import scan_repository


def process_uploaded_repository(project: Project, uploaded_file):
    upload_dir = Path(settings.MEDIA_ROOT) / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    zip_path = upload_dir / f"project_{project.id}.zip"

    try:
        with open(zip_path, "wb+") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        project.status = Project.Status.EXTRACTING
        project.save(update_fields=["status"])

        extract_project_zip(project, zip_path)

        scan_repository(project)

        if zip_path.exists():
            zip_path.unlink()

        project.refresh_from_db()

        return project

    except Exception:
        project.status = Project.Status.FAILED
        project.save(update_fields=["status"])
        raise