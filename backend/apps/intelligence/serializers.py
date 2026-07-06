from rest_framework import serializers


class RepositoryIntelligenceSerializer(serializers.Serializer):
    project = serializers.CharField()
    languages = serializers.ListField(child=serializers.CharField())
    frameworks = serializers.ListField(child=serializers.CharField())
    metadata = serializers.ListField()
    functions = serializers.IntegerField()
    classes = serializers.IntegerField()
    imports = serializers.IntegerField()
    files = serializers.IntegerField()
    dependencies = serializers.ListField(
    child=serializers.CharField()
)