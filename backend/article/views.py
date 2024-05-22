from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article
import base64
from django.shortcuts import get_object_or_404
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .analyzer import analyze_url
from .cloud import create_cloud
from .scrape import scrape_article

class AnalyzeURL(APIView):
    def get(self, request):
        url="https://n.news.naver.com/article/032/0003297852?cds=news_media_pc"
        #url = request.GET.get('url') 
        if not url:
            return Response({'error': 'URL parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        article_data = analyze_url(url)
        scrape = scrape_article(url)
        cloud=create_cloud(url)

        response_data = {
            "title": scrape["title"],
            "summary": scrape["summary"],
            "date": scrape["date"],
            "cloud_image": cloud["cloud"],
            "analysis_image": article_data["analysis"],
            "isscrape": article_data["isscrape"]
        }

        return Response(response_data)
    

class ArticleDetail(APIView):
    def get(self, request, id):
        article = get_object_or_404(Article, pk=id)

        response_data = {
            "id": article.id,
            "title": article.title,
            "summary": article.summary,
            "date": article.date.isoformat(),
            "cloud": article.cloud,  # 데이터베이스에서 가져온 Base64 인코딩된 이미지 데이터
            "analysis": article.analysis,  # 데이터베이스에서 가져온 Base64 인코딩된 이미지 데이터
            "isscrape": article.isscrape,
        }
        return Response(response_data)

@method_decorator(csrf_exempt, name='dispatch')
class UpdateScrapeStatus(APIView):
    def post(self, request):
        data = json.loads(request.body)
        article_id = data.get('articleId')
        article = get_object_or_404(Article, pk=article_id)
        article.isscrape = True
        article.save()
        return Response({"status": "scrape added"})

    def delete(self, request):
        article_id = request.GET.get('articleId')
        article = get_object_or_404(Article, pk=article_id)
        article.isscrape = False
        article.save()
        return Response({"status": "scrape removed"})
