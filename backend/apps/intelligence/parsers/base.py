from abc import ABC, abstractmethod


class BaseParser(ABC):
    """
    Base interface for all language parsers.
    """

    @abstractmethod
    def parse(self, file_path: str):
        """
        Parse a source code file and return structured data.
        """
        pass