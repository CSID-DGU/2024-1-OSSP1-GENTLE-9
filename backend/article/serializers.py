from rest_framework import serializers
from .models import Article, Scrape

class UrlSerializer(serializers.Serializer):
    url = serializers.URLField()
    def create(self, validated_data):
        # 데이터를 저장하지 않으므로, 단순히 validated_data를 반환합니다.
        return validated_data
    
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class ScrapeSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = Scrape
        fields = '__all__'