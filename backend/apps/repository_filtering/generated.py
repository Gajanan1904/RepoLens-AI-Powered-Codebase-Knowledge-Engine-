from pathlib import Path

from .constants import (
    GENERATED_FILE_PATTERNS,
    GENERATED_FILENAMES,
)


class GeneratedFileDetector:
    """
    Detects generated files that should be excluded from analysis.
    """
    @staticmethod
    def should_include(path: Path) -> bool:
        name = path.name

        if name in GENERATED_FILENAMES:
            return False

        for pattern in GENERATED_FILE_PATTERNS:
            if name.endswith(pattern):
                return False

        return True