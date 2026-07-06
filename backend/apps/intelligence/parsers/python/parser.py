from tree_sitter import Language, Parser
import tree_sitter_python

from apps.intelligence.parsers.base import BaseParser
from apps.intelligence.parsers.python.extractor import PythonExtractor
from apps.intelligence.parsers.python.import_extractor import PythonImportExtractor


class PythonParser(BaseParser):
    def __init__(self):
        language = Language(tree_sitter_python.language())
        self.parser = Parser(language)

    def parse(self, file_path: str):
        with open(file_path, "rb") as f:
            source = f.read()

        tree = self.parser.parse(source)
        root = tree.root_node

        extractor = PythonExtractor()
        extracted = extractor.extract(root, source)
        
        extracted["imports"] = PythonImportExtractor.extract(file_path)

        return {
            "language": "Python",
            "root_type": root.type,
            "has_error": root.has_error,
            **extracted,
        }