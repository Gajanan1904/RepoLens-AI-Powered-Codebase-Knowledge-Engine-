from rest_framework import serializers


class SemanticRetrievalSerializer(serializers.Serializer):
    project_id = serializers.IntegerField()
    question = serializers.CharField()
    top_k = serializers.IntegerField(default=5, required=False)