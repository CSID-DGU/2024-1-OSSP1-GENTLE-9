from django.urls import path
from runningpy import views

urlpatterns = [
    path('',views.index),
    path('result/',views.result),
    path('result/summarize/', views.summarize, name='summarize'),
    path('result/wordcloud/',views._wordcloud)
]
