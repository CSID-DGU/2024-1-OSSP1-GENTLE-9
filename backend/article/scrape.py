#기사 스크랩 기능
from bs4 import BeautifulSoup
from summarizer import Summarizer
import requests
import nltk


def scrape_article(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    #=====================================크롤링
    # 뉴스 게시 날짜
    date_tag = soup.find('span', class_='media_end_head_info_datestamp_time _ARTICLE_DATE_TIME')
    if date_tag:
        date_time = date_tag['data-date-time']
    # 뉴스사 이름 추출
    img_tag = soup.find('img', class_='media_end_head_top_logo_img')
    media_name = img_tag['alt'] if img_tag else 'Media name not found'
    # 'id'가 'dic_area'인 <article> 태그 찾기
    content_article = soup.find('article', id='dic_area')
    # 'id가 title area인 span 태그
    newstitle = soup.find('h2', id='title_area') 
    # <article> 태그 내의 모든 텍스트 추출x``
    title_text = ' '.join(newstitle.stripped_strings)
    # <article> 태그 내의 모든 텍스트 추출
    article_text = ' '.join(content_article.stripped_strings)
    #====================================크롤링
    return {
        "title": title_text,
        "date": date_time,
        "content": article_text,
        "_company": media_name
    }

def summary(news_content):
    model = Summarizer()
    result = model(news_content)

    return result