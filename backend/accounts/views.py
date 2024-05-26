from django.shortcuts import render, redirect
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import login
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

class KakaoLogin(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        kakao_auth_url = (
            f"https://kauth.kakao.com/oauth/authorize?response_type=code"
            f"&client_id={settings.KAKAO_REST_API_KEY}"
            f"&redirect_uri={settings.KAKAO_REDIRECT_URI}"
        )
        return redirect(kakao_auth_url)

class KakaoCallback(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get('code')
        token_url = 'https://kauth.kakao.com/oauth/token'
        redirect_uri = settings.KAKAO_REDIRECT_URI
        client_id = settings.KAKAO_REST_API_KEY

        token_data = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'code': code,
        }
        
        token_headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }

        token_res = requests.post(token_url, data=token_data, headers=token_headers)
        token_json = token_res.json()
        access_token = token_json.get('access_token')

        user_info_url = 'https://kapi.kakao.com/v2/user/me'
        user_info_headers = {
            'Authorization': f'Bearer {access_token}',
        }
        
        user_info_res = requests.get(user_info_url, headers=user_info_headers)
        user_info_json = user_info_res.json()

        kakao_id = user_info_json['id']
        nickname = user_info_json['properties']['nickname']

        # 유저 정보 저장 또는 업데이트
        try:
            user = User.objects.get(username=kakao_id)
        except User.DoesNotExist:
            user = User.objects.create(username=kakao_id, first_name=nickname)
        
        login(request, user)

        # 사용자 정보를 JSON 응답으로 반환
        response_data = {
            'username': user.username,
            'first_name': user.first_name,
        }

        # 로그인 후 클라이언트의 메인 페이지로 리디렉션
        return Response(response_data)
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        response_data = {
            'username': user.username,
            'first_name': user.first_name,
        }
        return Response(response_data)