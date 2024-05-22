#기사 스크랩 기능
from bs4 import BeautifulSoup
from summarizer import Summarizer
import requests
import nltk
from transformers import BertTokenizer, BertModel
from sentence_transformers import SentenceTransformer
from summarizer import Summarizer
from nltk.tokenize import sent_tokenize
import torch
from .models import Article

def scrape_article(url):
    article_json = crawl_content(url)
    sum = summary(article_json["content"])

    return {
        "title": article_json["title"],
        "summary": sum,
        "date": article_json["date"],
    }

def summary(news_content):
    model_name = 'sentence-transformers/bert-base-nli-mean-tokens'
    model = SentenceTransformer(model_name)
    
    # 문장별로 처리
    sentences = sent_tokenize(news_content)
    if len(sentences) < 3:#길이가 3줄보다 많아야 함
        return "Not enough sentences to summarize."    

    # 문장 임베딩
    sentence_embeddings = model.encode(sentences)

    # 문장 중요도 계산
    sentence_embeddings = torch.tensor(sentence_embeddings)
    k = min(3, len(sentences)) 
    important_sentence_indices = torch.topk(torch.norm(sentence_embeddings, dim=1), k).indices

    # 중요한 문장 출력
    result = " "
    important_sentences = [sentences[index] for index in important_sentence_indices]
    for sentence in important_sentences:
        result += sentence + " "
    
    return result

def crawl_content(url):
        # BeautifulSoup 객체 생성, HTML 파서로 'html.parser' 사용
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
        "content": article_text
    }