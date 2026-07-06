from pathlib import Path


class EntryPointDetector:

    CANDIDATES = {
        "manage.py",
        "main.py",
        "app.py",
        "server.py",
        "run.py",
        "server.js",
        "index.js",
        "main.js",
        "index.ts",
        "main.ts",
    }

    IGNORE_DIRS = {
        "env",
        "venv",
        ".venv",
        "__pycache__",
        "node_modules",
        ".git",
    }

    @classmethod
    def detect(cls, root_path):
        root = Path(root_path)

        entry_points = []

        for file in root.rglob("*"):
            if not file.is_file():
                continue

            if any(part in cls.IGNORE_DIRS for part in file.parts):
                continue

            if file.name in cls.CANDIDATES:
                entry_points.append(str(file.relative_to(root)))

        return entry_points