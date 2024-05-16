from rest_framework import serializers
from .models import Article, Cloud, Analysis

class CloudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cloud
        fields = '__all__'

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    cloud = CloudSerializer(many=True)
    analysis = AnalysisSerializer(many=True)

    class Meta:
        model = Article
        fields = '__all__'
