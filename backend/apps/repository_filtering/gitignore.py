from pathlib import Path

import pathspec


class GitIgnoreMatcher:
    """
    Loads and evaluates .gitignore rules using Git-compatible matching.
    """
    def __init__(self, repository_root: Path):
        self.repository_root = repository_root
        self.spec = self._load_gitignore()

    def _load_gitignore(self):
        gitignore_file = self.repository_root / ".gitignore"

        if not gitignore_file.exists():
            return None

        patterns = gitignore_file.read_text(
            encoding="utf-8",
            errors="ignore",
        ).splitlines()

        return pathspec.PathSpec.from_lines(
            "gitwildmatch",
            patterns,
        )

    def should_include(self, relative_path: Path) -> bool:
        if self.spec is None:
            return True

        return not self.spec.match_file(relative_path.as_posix())