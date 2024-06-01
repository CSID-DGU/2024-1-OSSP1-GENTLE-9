from django.urls import path
from .views import AnalyzeURL, ArticleDetail, UserScrapesView

urlpatterns = [
    path('result/', AnalyzeURL.as_view(), name='article_from_url'),
    path('articles/<int:id>/', ArticleDetail.as_view(), name='article_from_db'),
    path('scrape/', UserScrapesView.as_view(), name='update_scrape_status'),
]