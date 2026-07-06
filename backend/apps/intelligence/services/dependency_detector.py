from pathlib import Path


class DependencyDetector:

    DEPENDENCIES = {
        "django": "Django",
        "djangorestframework": "DRF",
        "rest_framework": "DRF",
        "simplejwt": "JWT",
        "psycopg2": "PostgreSQL",
        "mysqlclient": "MySQL",
        "sqlite3": "SQLite",
        "redis": "Redis",
        "celery": "Celery",
        "numpy": "NumPy",
        "pandas": "Pandas",
        "sklearn": "Scikit-Learn",
        "tensorflow": "TensorFlow",
        "torch": "PyTorch",
        "cv2": "OpenCV",
        "requests": "Requests",
        "sqlalchemy": "SQLAlchemy",
    }

    @classmethod
    def detect(cls, root_path):
        dependencies = set()

        root = Path(root_path)

        for file in root.rglob("*.py"):
            try:
                content = file.read_text(
                    encoding="utf-8",
                    errors="ignore",
                ).lower()
            except Exception:
                continue

            for keyword, dependency in cls.DEPENDENCIES.items():
                if keyword in content:
                    dependencies.add(dependency)

        return sorted(dependencies)