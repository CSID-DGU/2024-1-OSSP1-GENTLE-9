#article model
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=256)
    summary = models.TextField()
    date = models.DateField()
    cloud = models.TextField(null=True, blank=True)  # Base64 인코딩된 이미지
    analysis = models.TextField(null=True, blank=True)  # Base64 인코딩된 이미지
    isscrape = models.BooleanField(default=False)