from django.urls import path
from .views import KakaoLogin, KakaoCallback, CurrentUserView

urlpatterns = [
    path('kakao/login/', KakaoLogin.as_view(), name='kakao_login'),
    path('kakao/callback/', KakaoCallback.as_view(), name='kakao_callback'),
    path('current_user/', CurrentUserView.as_view(), name='current_user'),
]