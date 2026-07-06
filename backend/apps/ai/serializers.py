from rest_framework import serializers


class AIChatSerializer(serializers.Serializer):
    project_id = serializers.IntegerField()
    question = serializers.CharField()


class AIChatResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    provider = serializers.CharField()
    answer = serializers.CharField()