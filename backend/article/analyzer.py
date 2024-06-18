import pickle
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib 
# import torch
# from sklearn.feature_extraction.text import TfidfVectorizer
# from transformers import DistilBertTokenizer, DistilBertModel 

# def load_models():
#     # 모델 파일 경로
#     view_model_path = 'backend/article/whatView/linear_regression_model.pkl'
#     tendency_model_path = 'backend/article/model.pkl'
    
#     # 모델 파일을 불러옴
#     with open(view_model_path, 'rb') as model_file:
#         view_model = joblib.load(model_file)
#     with open(tendency_model_path, 'rb') as model_file:
#         tendency_model = pickle.load(model_file)
    
#     return view_model, tendency_model

# tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
# model = DistilBertModel.from_pretrained('distilbert-base-uncased')
# vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)

# def get_embeddings(text):
#     inputs = vectorizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
#     inputs = {key: val.to(device) for key, val in inputs.items()}
#     with torch.no_grad():
#         outputs = model(**inputs)
#     return outputs.last_hidden_state[:, 0, :].cpu().numpy()

def analyze_url(url):
    # temp_crawl = crawl_content(url)
    # news_title = temp_crawl["title"] #기사 제목
    # company = temp_crawl["_company"] #언론사 명
    
    # view_model, tendency_model = load_models()

    # # 관점 분석
    # input = vectorizer.fit_transform(news_title)
    # view_score = view_model.predict(input)
    
    # article_view = "기사 관점"
    # if -1 <= view_score < -0.4:
    #     article_view = "부정"
    # elif -0.4 <= view_score <= 0.2:
    #     article_view = "중립"
    # else:
    #     article_view = "긍정"

    # # 성향 분석
    # embedding = get_embeddings(news_title).reshape(1, -1)
    # prediction = tendency_model.predict(embedding)

    # # Boxplot
    # # 임시 데이터 생성
    # media_data = {
    #     "조선일보": 0.8,
    #     "중앙일보": 0.6,
    #     "서울신문": 0.1,
    #     "한국일보": 0.3,
    #     "경향신문": -0.6,
    #     "한겨레": -0.8,
    # }
    # data = []
    # media_names = []
    # for media, mean in media_data.items():
    #     random_values = np.random.uniform(low=mean-0.4, high=mean+0.4, size=100)
    #     data.extend(random_values)
    #     media_names.extend([media]*100)
    # # 데이터를 DataFrame으로 변환
    # df = pd.DataFrame({"언론사": media_names, "정치 성향": data})
    
    # new_article_media = company #언론사 연결(입력받음)
    # # new_article_value, hex_value = get_media_info(new_article_media)
    
    # plt.rcParams['font.family'] = 'Malgun Gothic'
    # plt.rcParams['axes.unicode_minus'] = False

    # plt.figure(figsize=(8, 6))
    # sns.boxplot(data=df, x='언론사', y='정치 성향', palette=colors)
    
    # # 제목 생성
    # title_text = f'분석된 {company} 기사의 정치 성향은 {prediction}입니다.'
    
    # # 텍스트 그리기
    # plt.title(title_text)
    # plt.grid(True)
    
    # # 새로운 뉴스 기사의 정치 성향 수치를 점으로 추가
    # plt.scatter(x=new_article_media, y=new_article_value, color='black', s=50, zorder=10)  # zorder를 높여서 박스 플롯 위에 점이 나타나도록 설정
    # plt.text(x=new_article_media, y=new_article_value + 0.05, s=f'{new_article_value:.2f}', color='black', va='baseline', ha='center', fontweight='bold' ,zorder=11)  # 점 위에 수치 정보 표시
    
    # # 이미지 파일로 저장
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
        
    # # 이미지 파일을 읽어 Base64로 인코딩
    # #with open(image_path, "rb") as image_file:
    # #    analysis_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    return {
        "analysis": "binary",
        "isscrape": False
    }
