# accounts/models.py
from django.db import models
from django.contrib.auth.models import User

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField()
    title = models.CharField(max_length=255)
    summary = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    cloud = models.TextField(null=True, blank=True)  # Base64 인코딩된 이미지
    analysis = models.TextField(null=True, blank=True)  # Base64 인코딩된 이미지
    isscrape = models.BooleanField(default=False)

    def __str__(self):
        return self.title