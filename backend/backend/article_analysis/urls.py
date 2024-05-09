from django.urls import path
from article_analysis import views

urlpatterns = [
    path('',views.index),
    path('calculate/',views.calculate),
    path('result/',views.result),
    path('calculate/summarize/', views.summarize, name='summarize'),
    path('calculate/wordcloud/',views._wordcloud),
    path("api/analysis/", views.analysis, name="analysis"),
]