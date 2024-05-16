from multiprocessing import context
from django.shortcuts import render, HttpResponse
import requests
from bs4 import BeautifulSoup
from summarizer import Summarizer
import nltk
from transformers import BertTokenizer, BertModel
from sentence_transformers import SentenceTransformer
import torch
from nltk.tokenize import sent_tokenize
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from collections import Counter
from konlpy.tag import Okt
from PIL import Image
import numpy as np
import sys
import jpype
import io
import matplotlib.pyplot as plt
import mysql.connector
from PIL import Image
import io
import os
import json

newscontext = " "
f_id_number = 0

def index(request):
    return render(request, 'runningpy/base.html')

def result(request):
    try:
        global newscontext
        if request.method == 'POST':
            n_link= request.POST.get('n1')
        
        response = requests.get(n_link) 
        response.raise_for_status()  # 오류가 있을 경우 예외 발생

        # BeautifulSoup 객체 생성, HTML 파서로 'html.parser' 사용
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
        #JSON으로 저장
        #05/16 기준 날짜, 기사 제목, 기사 본문, 신문사까지만 json으로 저장 그 외에는 임시로 값 설정
        news_data = {
            "date": date_time,
            "title": title_text,
            "article_text": article_text,
            "company": media_name,
            "cloud":{
			    "cloud_id": 2,
			    "f_id": 1,
                "fname":1 ,
                "extname":1,
                "fsize": 1,
                "f_width": 1,
                "f_height":1,
			    "f_data": 1
	        },
            "analysis":{
			"analysis_id": 2,
			"f_id": 1,
			"fname": 1,
			"extname": 1,
			"fsize": 1,
			"f_width": 1,
			"f_height": 1,
			"f_data": 1
            },
            "leanings": "0.8",
            "company": "중앙일보",
            "isscrape": 0
}

        
        newscontext = f"{media_name} {date_time} {title_text} {article_text}"
        news_json = json.dumps(news_data, ensure_ascii=False)

        with open('news_data.json', 'w', encoding='utf-8') as f:
            json.dump(news_data, f, ensure_ascii=False, indent=4)

        return render(request, 'runningpy/crawl.html', {'news_content': news_json})
    except requests.RequestException as e:
        return f"HTTP Error: {e}"
    except Exception as e:
        return f"An error occurred: {e}"


def summarize(request):
    model_name = 'sentence-transformers/bert-base-nli-mean-tokens'
    model = SentenceTransformer(model_name)
    
    # 문장별로 처리
    sentences = sent_tokenize(newscontext)
    if len(sentences) < 3:#길이가 3줄보다 많아야 함
        return HttpResponse("Not enough sentences to summarize.")    

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
    
    return HttpResponse(result)


    #로컬 DB에 연동
def create_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='1234',
        database='project_db'
    )

def upload_image_from_buffer(fid, buffer, file_name, format):#db에 이미지 업로드
    conn = create_db_connection()
    cursor = conn.cursor()
    
    # 이미지 속성 얻기
    img_byte_arr = io.BytesIO(buffer)
    img = Image.open(img_byte_arr)
    img_width, img_height = img.size
    file_size = len(buffer)

    # SQL 쿼리 준비
    sql = """INSERT INTO cloud_table (f_id, fname, extname, fsize, f_width, f_height, f_data) 
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (fid, file_name, format, file_size, img_width, img_height, buffer)#순서대로 기본키, 이름, png인지 jpg인지, 용량, 넓이, 높이, 몰라
    
    # 실행 및 커밋
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()

    print("이미지가 성공적으로 업로드 되었습니다!")


def _wordcloud(request):
    least_num = 2#2번 이상 호출된 단어만 워드 클라우드에 출력
    
    #matplotlib 대화형 모드 켜기
    plt.ion()

    text = newscontext
    # OKT 사전 설정
    okt = Okt()

    #명사만 추출
    nouns = okt.nouns(text)

    # 단어의 길이가 1개인 것은 제외
    words = [n for n in nouns if len(n) > 1]

    # 위에서 얻은 words를 처리하여 단어별 빈도수 형태의 딕셔너리 데이터를 구함
    c = Counter(words)
    print(c)

    #최소 빈도수 처리
    key = list(c.keys())
    for a in key:
        if(c[a] < least_num):
            del c[a]

    #빈도수가 맞지 않을 시 프로그램을 종료
    if(len(c) == 0):
        print("최소 빈도수가 너무 큽니다. 다시 설정해 주세요.")
        print("프로그램을 종료합니다.")
        sys.exit()

    #워드클라우드 만들기
    wc = WordCloud(background_color="white" ,  font_path=r"C:/Windows/Fonts/malgun.ttf", width=600, height=600, scale=2.0, max_font_size=250)
    #가로 600, 세로 600, 크기 2, 최대 글자 크기 250
    gen = wc.generate_from_frequencies(c)

    buffer = io.BytesIO()

    gen.to_image().save(buffer, format='PNG')
    buffer.seek(0)

    global f_id_number#기본키

    img_byte_arr = buffer.getvalue()
    upload_image_from_buffer(f_id_number, img_byte_arr, 'bluIe_image.jpg', 'PNG')
    f_id_number += 1#기본키를 1씩 증가 시켜 기본키의 중복을 방지한다.

    file_id_to_download = 1  # 데이터베이스에서 다운로드할 이미지의 파일 ID
    #download_path = "downloadimage"  # 이미지를 저장할 경로
    #download_image(file_id_to_download, download_path)
    return HttpResponse(buffer.getvalue(), content_type='image/png')