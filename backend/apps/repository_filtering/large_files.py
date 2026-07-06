from pathlib import Path

from .constants import MAX_SOURCE_FILE_SIZE


class LargeFileDetector:
    
    @staticmethod
    def should_include(path: Path) -> bool:
        try:
            return path.stat().st_size <= MAX_SOURCE_FILE_SIZE
        except OSError:
            return False