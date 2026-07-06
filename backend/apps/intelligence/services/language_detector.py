from pathlib import Path


class LanguageDetector:
    """
    Detects the programming language of a file based on its extension
    or special filename.
    """

    EXTENSION_MAP = {
        ".py": "Python",
        ".js": "JavaScript",
        ".ts": "TypeScript",
        ".java": "Java",
        ".cpp": "C++",
        ".c": "C",
        ".cs": "C#",
        ".go": "Go",
        ".rs": "Rust",
        ".php": "PHP",
        ".rb": "Ruby",
        ".swift": "Swift",
        ".kt": "Kotlin",
        ".html": "HTML",
        ".css": "CSS",
        ".sql": "SQL",
        ".json": "JSON",
        ".xml": "XML",
        ".yaml": "YAML",
        ".yml": "YAML",
        ".md": "Markdown",
    }

    SPECIAL_FILES = {
        "Dockerfile": "Docker",
        "Makefile": "Makefile",
        "CMakeLists.txt": "CMake",
        "requirements.txt": "Requirements",
        "package.json": "Node.js",
        "pom.xml": "Maven",
        "build.gradle": "Gradle",
        "Cargo.toml": "Rust",
        "go.mod": "Go",
    }

    @classmethod
    def detect(cls, file_path: str) -> str:
        filename = Path(file_path).name

        # Check special files first
        if filename in cls.SPECIAL_FILES:
            return cls.SPECIAL_FILES[filename]

        # Check extension
        extension = Path(file_path).suffix.lower()

        return cls.EXTENSION_MAP.get(extension, "Unknown")