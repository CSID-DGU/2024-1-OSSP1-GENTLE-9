from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article, Scrape
from django.shortcuts import get_object_or_404
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .analyzer import analyze_url
from .cloud import create_cloud
from .scrape import scrape_article
from .serializers import UrlSerializer, ScrapeSerializer
from rest_framework.permissions import IsAuthenticated


class AnalyzeURL(APIView):
    def post(self, request):
        serializer = UrlSerializer(data=request.data)
        
        if serializer.is_valid():
            validated_data = serializer.save()  # validated_data는 {'url': url} 형태입니다.
            url = validated_data['url']  # 검증된 URL 가져오기


            # URL 분석 및 스크래핑 로직 호출
            article_data = analyze_url(url)
            scrape = scrape_article(url)
            cloud = create_cloud(url)

            # 응답 데이터 구성
            response_data = {
                "title": scrape["title"],
                "summary": scrape["summary"],
                "date": scrape["date"],
                "cloud_image": cloud["cloud"],
                "analysis_image": article_data["analysis"],
                "isscrape": article_data["isscrape"],
                "url": url
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

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
class UserScrapesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        scrapes = Scrape.objects.filter(user=user)
        serializer = ScrapeSerializer(scrapes, many=True)
        return Response(serializer.data)
