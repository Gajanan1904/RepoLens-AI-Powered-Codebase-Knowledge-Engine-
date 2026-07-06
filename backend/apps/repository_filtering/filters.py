from pathlib import Path

from .constants import (
    DEFAULT_IGNORED_DIRECTORIES,
    DEFAULT_IGNORED_FILES,
)


class RepositoryFilterEngine:
    """
    Filters repository files before scanning.
    """

    def should_include(self, path: Path) -> bool:
        parts = set(path.parts)

        # Ignore directories
        if parts.intersection(DEFAULT_IGNORED_DIRECTORIES):
            return False

        # Ignore files
        if path.name in DEFAULT_IGNORED_FILES:
            return False

        return True