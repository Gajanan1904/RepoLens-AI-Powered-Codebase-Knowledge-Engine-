from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.email")

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "name",
            "description",
            "upload_type",
            "repository_name",
            "storage_path",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "status",
            "created_at",
            "updated_at",
        ]