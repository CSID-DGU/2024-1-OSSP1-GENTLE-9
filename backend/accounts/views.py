from django.shortcuts import redirect
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Bookmark
from .serializers import BookmarkSerializer

@method_decorator(csrf_exempt,name ='dispatch')
class KakaoLogin(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        kakao_auth_url = (
            f"https://kauth.kakao.com/oauth/authorize?response_type=code"
            f"&client_id={settings.KAKAO_REST_API_KEY}"
            f"&redirect_uri={settings.KAKAO_REDIRECT_URI}"
        )
        return redirect(kakao_auth_url)

@method_decorator(csrf_exempt, name='dispatch')
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

        # JWT 토큰 생성
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # 로그인 후 클라이언트의 메인 페이지로 리디렉션하면서 토큰 전달
        response = redirect(f'http://localhost:3000/?token={access_token}')
        return response
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        response_data = {
            'username': user.username,
            'first_name': user.first_name,
        }
        return Response(response_data)
    
class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        }
        return JsonResponse(data)
    
class BookmarkToggle(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        url = request.data.get('url')
        title = request.data.get('title')
        summary = request.data.get('summary')

        # 해당 URL의 북마크가 있는지 확인
        bookmark, created = Bookmark.objects.get_or_create(
            user=request.user,
            url=url,
            defaults={'title': title, 'summary': summary}
        )

        if not created:
            # 이미 북마크가 존재하면 삭제
            bookmark.delete()
            return Response({'status': 'bookmark removed'}, status=200)
        else:
            # 새로 생성된 경우 북마크 추가
            return Response(BookmarkSerializer(bookmark).data, status=201)

class BookmarkList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)
