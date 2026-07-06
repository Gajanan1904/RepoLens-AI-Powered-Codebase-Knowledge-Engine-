class ProjectTypeDetector:
    """
    Infers the overall type of a repository based on
    detected frameworks and metadata.
    """

    BACKEND_FRAMEWORKS = {
        "Django",
        "Flask",
        "FastAPI",
        "Spring Boot",
        "Laravel",
        "Express",
    }

    FRONTEND_FRAMEWORKS = {
        "React",
        "Next.js",
        "Vue",
        "Angular",
    }

    @classmethod
    def detect(cls, frameworks, metadata):
        framework_names = {
            framework["name"] if isinstance(framework, dict) else framework
            for framework in frameworks
        }
        
        metadata_keys = {
            item["key"] if isinstance(item, dict) else item.key
            for item in metadata
        }

        has_backend = bool(
            framework_names & cls.BACKEND_FRAMEWORKS
        )

        has_frontend = bool(
            framework_names & cls.FRONTEND_FRAMEWORKS
        )

        if has_backend and has_frontend:
            return {
                "type": "Full Stack",
                "reason": "Backend and frontend frameworks detected.",
            }

        if has_backend:
            return {
                "type": "Backend API",
                "reason": "Backend framework detected.",
            }

        if has_frontend:
            return {
                "type": "Frontend",
                "reason": "Frontend framework detected.",
            }
            
        if "PackageJSON" in metadata_keys:
            return {
                "type": "Frontend",
                "reason": "package.json detected without a recognized backend framework.",
            }

        if "Requirements" in metadata_keys or "PyProject" in metadata_keys:
            return {
                "type": "Backend API",
                "reason": "Python project metadata detected.",
            }

        return {
            "type": "Unknown",
            "reason": "No recognized framework combination found.",
        }