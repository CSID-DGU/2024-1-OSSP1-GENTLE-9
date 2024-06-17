from rest_framework import serializers
from .models import Bookmark

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'url', 'title', 'summary', 'date', 'cloud', 'analysis', 'isscrape']
        read_only_fields = ['user', 'date']