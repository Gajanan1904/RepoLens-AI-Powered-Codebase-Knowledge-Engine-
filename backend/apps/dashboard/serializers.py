from rest_framework import serializers


class DashboardSerializer(serializers.Serializer):
    summary = serializers.DictField()
    recent_repositories = serializers.ListField()
    processing_status = serializers.DictField()
    language_distribution = serializers.ListField()
    project_type_distribution = serializers.ListField()