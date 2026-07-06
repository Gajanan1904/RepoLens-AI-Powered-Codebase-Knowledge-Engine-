import ast


class PythonImportExtractor:

    @staticmethod
    def extract(file_path):
        imports = []

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                tree = ast.parse(f.read())
        except Exception:
            return imports

        for node in ast.walk(tree):

            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)

            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)

        return sorted(set(imports))