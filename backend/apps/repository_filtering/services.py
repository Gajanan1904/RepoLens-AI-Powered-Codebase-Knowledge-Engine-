from pathlib import Path

from .filters import RepositoryFilterEngine
from .gitignore import GitIgnoreMatcher
from .binary import BinaryFileDetector
from .generated import GeneratedFileDetector
from .large_files import LargeFileDetector

class RepositoryFilteringService:
    """
    Filters repository files before they enter the scanning pipeline.
    Applies all filtering rules before scanning begins.
    """
    
    def __init__(self, repository_root: Path):
        self.repository_root = repository_root
        self.engine = RepositoryFilterEngine()
        self.gitignore = GitIgnoreMatcher(repository_root)

    def should_include(self, path: Path) -> bool:
        if not self.engine.should_include(path):
            return False
        
        if not BinaryFileDetector.should_include(path):
            return False
        
        if not GeneratedFileDetector.should_include(path):
            return False
        
        if not LargeFileDetector.should_include(self.repository_root / path):
            return False

        return self.gitignore.should_include(path)