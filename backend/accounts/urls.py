# accounts/urls.py
from django.urls import path
from .views import BookmarkToggle, KakaoLogin, KakaoCallback, CurrentUserView, UserProfile, BookmarkList

urlpatterns = [
    path('kakao/login/', KakaoLogin.as_view(), name='kakao_login'),
    path('kakao/callback/', KakaoCallback.as_view(), name='kakao_callback'),
    path('current_user/', CurrentUserView.as_view(), name='current_user'),
    path('user/', UserProfile.as_view(), name='user-profile'),
    path('bookmarks/', BookmarkToggle.as_view(), name='bookmark-toggle'),
    path('bookmarks/list/', BookmarkList.as_view(), name='bookmark-list'),
]
