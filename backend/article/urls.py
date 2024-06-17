from django.urls import path
from .views import AnalyzeURL

urlpatterns = [
    path('result/', AnalyzeURL.as_view(), name='article_from_url'),
]