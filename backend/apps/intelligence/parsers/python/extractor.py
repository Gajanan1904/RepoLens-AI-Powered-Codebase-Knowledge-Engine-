from platform import node


class PythonExtractor:

    def extract(self, root, source):
        data = {
            "imports": [],
            "classes": [],
            "functions": [],
        }

        self.walk(root, source, data)

        return data

    def walk(self, node, source, data):

        if node.type == "function_definition":
            name = node.child_by_field_name("name")

            if name:
                data["functions"].append(
                    source[name.start_byte:name.end_byte].decode()
                )

        elif node.type == "class_definition":
            name = node.child_by_field_name("name")

            if name:
                data["classes"].append(
                    source[name.start_byte:name.end_byte].decode()
                )

        elif node.type == "import_statement":
            for child in node.named_children:
                if child.type == "dotted_name":
                    module = source[
                        child.start_byte:child.end_byte
                    ].decode()

                    if module not in data["imports"]:
                        data["imports"].append(module)

        elif node.type == "import_from_statement":
            module = node.child_by_field_name("module")

            if module:
                module_name = source[
                    module.start_byte:module.end_byte
                ].decode()

                if module_name not in data["imports"]:
                    data["imports"].append(module_name)

        for child in node.named_children:
            self.walk(child, source, data)