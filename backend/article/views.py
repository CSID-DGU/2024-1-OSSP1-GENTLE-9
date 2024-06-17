from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .analyzer import analyze_url
from .cloud import create_cloud
from .scrape import scrape_article, summary
from .serializers import UrlSerializer



class AnalyzeURL(APIView):
    def post(self, request):
        serializer = UrlSerializer(data=request.data)
        
        if serializer.is_valid():
            validated_data = serializer.save()  # validated_data는 {'url': url} 형태입니다.
            url = validated_data['url']  # 검증된 URL 가져오기


            # URL 분석 및 스크래핑 로직 호출
            scrape = scrape_article(url)#기사 제목, 날짜, 본문 반환
            cloud = create_cloud(url)#기사 본문을 기반으로 워드클라우드 제작
            article_data = analyze_url(url)#기사 분석
            summary_result = summary(scrape["content"])#기사 요약


            # 응답 데이터 구성
            response_data = {
                "title": scrape["title"],
                "summary": summary_result,
                "date": scrape["date"],
                "cloud": cloud["cloud"],
                "analysis": article_data["analysis"],
                "isscrape": article_data["isscrape"],
                "url": url
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

