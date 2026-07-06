from rest_framework import serializers


class ProjectUploadSerializer(serializers.Serializer):
    zip_file = serializers.FileField()

    def validate_zip_file(self, value):
        if not value.name.endswith(".zip"):
            raise serializers.ValidationError("Only ZIP files are allowed.")

        if value.size > 100 * 1024 * 1024:  # 100 MB
            raise serializers.ValidationError("ZIP file size cannot exceed 100 MB.")

        return value