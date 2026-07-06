from apps.intelligence.parsers.python.parser import PythonParser


class ParserRegistry:
    """
    Returns the appropriate parser based on language.
    """

    _parsers = {
        "Python": PythonParser,
    }

    @classmethod
    def get_parser(cls, language: str):
        parser_class = cls._parsers.get(language)

        if parser_class is None:
            return None

        return parser_class()