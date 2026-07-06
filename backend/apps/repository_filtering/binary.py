from pathlib import Path

from .constants import BINARY_EXTENSIONS



class BinaryFileDetector:
    """
    Detects binary files based on their file extensions.
    """
    @staticmethod
    def should_include(path: Path) -> bool:
        return path.suffix.lower() not in BINARY_EXTENSIONS