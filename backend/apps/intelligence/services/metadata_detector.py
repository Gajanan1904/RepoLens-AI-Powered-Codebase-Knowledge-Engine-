from pathlib import Path


class MetadataDetector:

    FILES = {
        "README.md": ("README", "Present"),
        "requirements.txt": ("Requirements", "Present"),
        "pyproject.toml": ("PyProject", "Present"),
        "package.json": ("PackageJSON", "Present"),
        "Dockerfile": ("Docker", "Present"),
        "docker-compose.yml": ("DockerCompose", "Present"),
        "pom.xml": ("Maven", "Present"),
        "Cargo.toml": ("Cargo", "Present"),
        "LICENSE": ("License", "Present"),
        ".gitignore": ("GitIgnore", "Present"),
    }

    @classmethod
    def detect(cls, root_path):
        metadata = []

        root = Path(root_path)

        for filename, (key, value) in cls.FILES.items():
            if (root / filename).exists():
                metadata.append(
                    {
                        "key": key,
                        "value": value,
                    }
                )

        return metadata