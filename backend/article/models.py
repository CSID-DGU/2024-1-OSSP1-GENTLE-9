#article model
from django.db import models
from django.contrib.auth.models import User

class Article(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=256)
    summary = models.TextField()
    date = models.DateField()
    cloud = models.TextField(null=True, blank=True)  # Base64 인코딩된 이미지
    analysis = models.TextField(null=True, blank=True)  # Base64 인코딩된 이미지
    isscrape = models.BooleanField(default=False)

class Scrape(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
