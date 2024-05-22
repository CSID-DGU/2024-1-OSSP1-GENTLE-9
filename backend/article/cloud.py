#워드 클라우드 생성
import base64
import os
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from collections import Counter
from konlpy.tag import Okt
from .scrape import crawl_content
import sys
import jpype
import io
import matplotlib.pyplot as plt


def create_cloud(url):
    #워드 클라우드 생성 코드 작성
    news_content = crawl_content(url)#Json 형식으로 news_content에 저장
    least_num = 2#2번 이상 호출된 단어만 워드 클라우드에 출력
    
    #matplotlib 대화형 모드 켜기
    plt.ion()

    text = news_content["content"]#본문만 빼오기
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

    font_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'fonts', 'HanSantteutDotum-Regular.ttf')
    
    #워드클라우드 만들기
    wc = WordCloud(background_color="white" ,  font_path=font_path, width=600, height=600, scale=2.0, max_font_size=250)
    #가로 600, 세로 600, 크기 2, 최대 글자 크기 250
    gen = wc.generate_from_frequencies(c)
    img = gen.to_image()

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    #프로젝트 루트 디렉토리에 있는 더미 이미지 파일 경로
    #cloud_image_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dummy_images', 'cloud_image.png')
    
    
    cloud_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return {
        "cloud": cloud_image,
    }