# accounts/urls.py
from django.urls import path
from .views import BookmarkToggle, KakaoLogin, KakaoCallback, CurrentUserView, BookmarkList, BookmarkData

urlpatterns = [
    path('kakao/login/', KakaoLogin.as_view(), name='kakao_login'),
    path('kakao/callback/', KakaoCallback.as_view(), name='kakao_callback'),
    path('current_user/', CurrentUserView.as_view(), name='current_user'),
    path('bookmarks/', BookmarkToggle.as_view(), name='bookmark-toggle'),
    path('bookmarks/<int:pk>/', BookmarkData.as_view(), name='bookmark-toggle'),
    path('bookmarks/list/', BookmarkList.as_view(), name='bookmark-list'),
]
