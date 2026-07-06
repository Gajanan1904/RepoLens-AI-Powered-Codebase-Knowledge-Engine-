from pathlib import Path


class FrameworkDetector:
    PYTHON_FRAMEWORKS = {
        "django": "Django",
        "flask": "Flask",
        "fastapi": "FastAPI",
    }

    @classmethod
    def detect_repository(cls, root_path):
        frameworks = set()

        root = Path(root_path)

        for file in root.rglob("*.py"):
            try:
                content = file.read_text(encoding="utf-8", errors="ignore").lower()
            except Exception:
                continue

            for keyword, framework in cls.PYTHON_FRAMEWORKS.items():
                if keyword in content:
                    frameworks.add(framework)

        return list(frameworks)