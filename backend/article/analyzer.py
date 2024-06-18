import os
import pandas as pd
import numpy as np
import re
import sys
import torch
import torch.nn as nn
from .scrape import scrape_article
import base64
from io import BytesIO

# 시각화
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import seaborn as sns
from matplotlib.colors import Normalize
from matplotlib.cm import ScalarMappable

# 모델
import pickle
from bareunpy import Tagger
from transformers import BertModel, BertTokenizer
from transformers import BertForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression
import joblib

# load tokenizer
current_directory = os.path.dirname(os.path.abspath(__file__))

kpf_folder_path = os.path.join(current_directory, "KPF-BERT")


# 관점 모델 전처리 함수
def remove_view_pattern(text):
    text = re.sub(r'\[[^\]]*\]', '', text)  # 대괄호 안의 텍스트 제거
    text = re.sub(r'\d+', '', text)  # 숫자 제거
    text = re.sub(r'\s+', ' ', text)  # 여러 공백을 하나로
    text = re.sub(r'[^\w\s]', '', text)  # 특수 문자 제거
    return text

# 성향 모델 전처리 함수
def remove_score_pattern(text):
    tagger = Tagger("koba-BIXUVYI-7WDEZNQ-RBTFE7A-BKTNZXY") # load tagger
    stop_pos = ['NP', 'NR', # 대명사, 수사
            'JKS', 'JKC', 'JKG', 'JKO', 'JKB', 'JKV', 'JKQ', 'JX', 'JC', # 조사
            'EP', 'EF', 'EC', 'ETN', 'ETM', # 어미
            'XPN', 'XSN', 'XSV', 'XSA', # 접두사
            'NA'] # 분석 불능 범주
            # 특수기호는 일괄 삭제 예정이므로 처리 안 함
    
    # regular expression
    text = re.sub(r'\[[^\]]*\]', '', text) # 괄호와 괄호 안의 단어 삭제
    text = re.sub('[\W]+', ' ', text) # 특수문자 제거
    
    # 불용어 제거
    wrdlst = []
    res = tagger.tag(text)
    for tup in res.pos():
        pos = tup[1]
        if pos not in stop_pos:
            wrdlst.append(tup[0])    
    if not wrdlst:
        return pd.NA
    else:
        restext = " ".join(wrdlst)
        return restext

# bert 전처리 함수
def preprocess_bert(text, max_len=128):
    # tokenizer = BertTokenizer.from_pretrained(kpf_folder_path) # load tokenizer
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    text = "[CLS] " + text + " [SEP]" # BERT의 입력 형식에 맞게 변환
    encoded_dict = tokenizer.encode_plus(
        text,
        add_special_tokens=True,
        max_length=max_len,
        pad_to_max_length=True,
        return_attention_mask=True,
        return_tensors='pt',
        truncation=True
    )
    input_ids = encoded_dict['input_ids'] 
    attention_mask = encoded_dict['attention_mask']
    return input_ids, attention_mask

# 성향 분석 모델 클래스 정의 및 모델 초기화
# class BertForClassification(nn.Module):
#     def __init__(self, bert_model):
#         super(BertForClassification, self).__init__()
#         self.bert = bert_model
#         self.classifier = nn.Linear(768, 2)
    
#     def forward(self, input_ids, attention_mask):
#         outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
#         pooled_output = outputs.pooler_output
#         return self.classifier(pooled_output)
class BertForClassification(nn.Module):
    def __init__(self, bert_model):
        super(BertForClassification, self).__init__()
        self.bert = bert_model
        self.classifier = nn.Linear(768, 2)
    
    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        return self.classifier(pooled_output)

# def predict_with_linear_regression(model, input_data):
#     # Ensure input_data is 2-dimensional
#     if input_data.ndim == 1:
#         input_data = input_data.reshape(1, -1)  # Reshape to a row vector
    
#     prediction = model.predict(input_data)
#     return prediction

def load_models():
    # 현재 디렉토리 설정
    current_directory = os.path.dirname(os.path.abspath(__file__))
    # kpf_folder_path = os.path.join(current_directory, 'KPF-BERT')

    
    # 모델 파일 경로 설정
    view_model_path = os.path.join(current_directory, 'whatView', 'linear_regression_model.pkl')
    # tendency_model_path = os.path.join(current_directory, 'whatView', 'model_state_dict.pth')

    # View 모델 파일을 불러옴
    # try:
    #     with open(view_model_path, 'rb') as model_file:
    #         view_model = pickle.load(model_file)
    #     print("View 모델이 성공적으로 로드되었습니다.")
    # except FileNotFoundError as e:
    #     print(f"View 모델 파일을 찾을 수 없습니다: {e}")
    #     return None, None
    # except Exception as e:
    #     print(f"View 모델을 로드하는 동안 오류가 발생했습니다: {e}")
    #     return None, None
    # coefficients_read = []
    # # 텍스트 파일에서 리스트 읽어오기
    # with open(os.path.join(current_directory, 'whatView', 'coefficients.txt'), 'r') as f:
    #     for line in f:
    #         coefficients_read.append(float(line.strip()))
    # view_model = LinearRegression()
    # view_model.coef_ = np.array(coefficients_read)
    # view_model.intercept_ = np.array([-0.18398042596644096])
    with open(view_model_path, 'rb') as model_file:
        view_model = joblib.load(model_file)
    # BERT 모델 로드
    # bert_model = BertModel.from_pretrained(kpf_folder_path)
    bert_model = BertModel.from_pretrained("bert-base-uncased")

    # 다운로드한 모델 파일을 로드하여 모델에 적용
    # model_url = "https://drive.google.com/uc?id=1R6Vs8WRDGMVAQLdcK2gGU6AcI4FHy4-1"
    # gdown.download(model_url, tendency_model_path, quiet=False)
        
    # state_dict = torch.load(tendency_model_path)
    tendency_model = BertForClassification(bert_model)
    # tendency_model.load_state_dict(state_dict)
    tendency_model.eval()

    return view_model, tendency_model

def analyze_url(url):
    temp_crawl = scrape_article(url)
    news_title = temp_crawl["title"] #기사 제목
    view_model, tendency_model = load_models()
    
    vectorizer_path = os.path.join(current_directory, 'whatView', 'tfidf_vectorizer.pkl')
    try:
        with open(vectorizer_path, 'rb') as model_file:
            vectorizer = joblib.load(model_file)
    except FileNotFoundError:
        print(f"File not found: {vectorizer_path}")
        vectorizer = None
    # vectorizer = TfidfVectorizer(max_features=5000) # load vectorizer
    
    # 관점 분석
    # view_title = remove_view_pattern(news_title)
    # input = vectorizer.fit_transform([view_title])  # 리스트로 변환
    # view_score = view_model.predict(input)
    view_title = remove_view_pattern(news_title)
    vectorized_title = vectorizer.transform([view_title])
    dense_title = vectorized_title.toarray()
    # view_score = view_model(input)
    view_score = view_model.predict(dense_title)

    if -1 <= view_score < -0.4:
        article_view = "부정"
    elif -0.4 <= view_score <= 0.2:
        article_view = "중립"
    else:
        article_view = "긍정"
    
    # 성향 분석
    score_title = remove_score_pattern(news_title)
    input_ids, attention_mask = preprocess_bert(score_title)
    
    with torch.no_grad():
        outputs = tendency_model(input_ids, attention_mask=attention_mask)

    logits = outputs[0]
    probs = torch.softmax(logits, dim=-1).detach().cpu().numpy()

    # 확률을 [-1, 1] 범위로 변환
    prob_class_1 = probs[1]
    news_score = (2 * prob_class_1) - 1

    if news_score <= -0.7:
        news_stance = '진보 성향이 매우 강한'
    elif -0.7 < news_score <= -0.4:
        news_stance = '중도 진보 성향을 가진'
    elif -0.4 < news_score <= 0.4:
        news_stance = '중도 성향을 가진'
    elif 0.4 < news_score <= 0.7:
        news_stance = '중도 보수 성향을 가진'
    else:
        news_stance = '보수 성향이 매우 강한'
    
    # Boxplot
    # 폰트 설정
    font_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'fonts', 'HanSantteutDotum-Regular.ttf')
    font_prop = fm.FontProperties(fname=font_path)
    plt.rcParams['font.family'] = font_prop.get_name()
    
    # cmap 및 normalization 설정
    cmap = plt.get_cmap('coolwarm')  # 원하는 컬러 맵 선택
    norm = Normalize(vmin=-1, vmax=1) # x축 범위에 맞춰 normalization 설정
    sm = ScalarMappable(cmap=cmap, norm=norm)

    # 1개년 분석 파일 로드
    news_data = pd.read_csv(os.path.join(current_directory, 'whatScore', '2023_analysis.csv'))
    # order = ['경향신문', '서울신문', '조선일보', '중앙일보', '한겨레', '한국일보']
    grouped_data = news_data.groupby('Press')['Score'].apply(list)
    data = [score_list for score_list in grouped_data]

    fig, ax = plt.subplots(figsize=(8, 6))
    box = ax.boxplot(data, patch_artist=True, 
                    boxprops=dict(color="gray"),
                    whiskerprops=dict(color="gray"),
                    capprops=dict(color="gray"),
                    medianprops=dict(color="gray"),
                    vert=False)
    for patch in box['boxes']:
        patch.set_facecolor('lightgray')
        
    # y축
    ax.set_yticks(np.arange(1, len(grouped_data) + 1))
    ax.set_yticklabels(grouped_data.index, fontsize=11)

    # x축
    ax.set_xticks([])
    ax.set_xlim([-1, 1])

    # 축 위치 조정을 위해 별도의 축 생성
    cax = fig.add_axes([0.125, 0.09, 0.775, 0.03])

    # 그라데이션 바
    cax.bar(0.5, 0.3, width=1, color='none')
    gradient = np.linspace(0, 1, 256).reshape(1, -1)
    cax.imshow(gradient, aspect='auto', cmap=cmap, extent=[0, 1, 0, 1])
    cax.grid(False)

    # 눈금 0.2 단위로
    tick_labels = np.arange(-1, 1.1, 0.2)
    tick_positions = norm(tick_labels)
    cax.set_xticks(tick_positions)
    cax.set_xticklabels([f'{label:.1f}' for label in tick_labels], fontsize=11)
    cax.set_yticks([])

    # 그래프 맨 왼쪽에 '진보', 오른쪽에 '보수' 텍스트 추가
    fig.text(0.1, 0.1, '진보', ha='center', va='center', fontsize=12, fontweight='black', color=sm.to_rgba(-1.5))
    fig.text(0.925, 0.1, '보수', ha='center', va='center', fontsize=12, fontweight='black', color=sm.to_rgba(1.5))

    # 분석 기사의 정보
    article_color = sm.to_rgba(news_score)
    ax.text(news_score,
            6.5,
            s=f'{news_score:.2f}',
            color=article_color,
            va='bottom', ha='center',
            fontsize=12,
            fontweight='black',
            zorder=11,
            clip_on=False)
    ax.axvline(x=news_score, color=article_color, linewidth=3, zorder=9)

    plt.text(0.5, -0.11, f'{news_stance} 기사이며, {article_view}적인 시각으로 작성되었습니다.',
            ha='center', va='top',
            transform=ax.transAxes,
            fontsize=15,
            fontweight='black')

    cax.grid(False)
    ax.grid(False)
    plt.grid(False)
    plt.show()
    
    # # 이미지 저장
    # buffer = BytesIO()
    # plt.savefig(buffer, format="png")
    # buffer.seek(0)
    # img_str = base64.b64encode(buffer.read()).decode('utf-8')
    # analysis_image_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dummy_images', 'analysis_image.png')
    
    # # Boxplot을 파일로 저장
    # with open(analysis_image_path, "wb") as f:
    #     f.write(buffer.getbuffer())

    # # 파일을 읽어 Base64로 인코딩
    # with open(analysis_image_path, "rb") as image_file:
    #     analysis_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    # return {
    #     "analysis": "binary",
    #     "isscrape": False
    # }
    # 이미지 저장을 위한 버퍼 생성
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)

    # 이미지를 Base64 문자열로 인코딩
    img_str = base64.b64encode(buffer.read()).decode('utf-8')

    # 이미지 파일 경로 설정
    project_root = os.path.dirname(os.path.dirname(__file__))
    dummy_images_dir = os.path.join(project_root, 'dummy_images')
    analysis_image_path = os.path.join(dummy_images_dir, 'analysis_image.png')

    # 디렉토리가 존재하지 않으면 생성
    if not os.path.exists(dummy_images_dir):
        os.makedirs(dummy_images_dir)

    # Boxplot을 파일로 저장
    with open(analysis_image_path, "wb") as f:
        f.write(buffer.getbuffer())

    # 파일을 읽어 Base64로 인코딩
    with open(analysis_image_path, "rb") as image_file:
        analysis_image = base64.b64encode(image_file.read()).decode('utf-8')


    # 결과 반환
    return {
        "analysis": analysis_image,
        "isscrape": False
    }