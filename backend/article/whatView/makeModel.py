import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
import re
import joblib

# 데이터 불러오기 & 필요한 열만 선택
analysis_news = pd.read_csv("analysis_news.csv")
data = analysis_news[['Title', 'Tendency']]

# 중복값 삭제
data = data.drop_duplicates()

# 괄호 안 단어 삭제 및 텍스트 전처리
def remove_pattern(text):
    text = re.sub(r'\[[^\]]*\]', '', text)  # 대괄호 안의 텍스트 제거
    text = re.sub(r'\d+', '', text)  # 숫자 제거
    text = re.sub(r'\s+', ' ', text)  # 여러 공백을 하나로
    text = re.sub(r'[^\w\s]', '', text)  # 특수 문자 제거
    return text

data['Title'] = data['Title'].apply(remove_pattern)

# 데이터 분리
X = [remove_pattern(t) for t in data['Title'].values]
Y = data['Tendency']

# 텍스트 데이터 벡터화
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_vectorized = vectorizer.fit_transform(X)

# TF-IDF 벡터를 밀집 배열로 변환
X_dense = X_vectorized.toarray()

# 텍스트 데이터 벡터화한 후 수치를 정규화
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_dense)

# 데이터 분할: 학습 데이터와 테스트 데이터
X_train, X_test, Y_train, Y_test = train_test_split(X_scaled, Y, test_size=0.2, random_state=42)

# 모델 선택 (선형 회귀 사용)
model = LinearRegression()

# 모델 학습
model.fit(X_train, Y_train)

# 모델 저장
joblib.dump(model, 'linear_regression_model.pkl')
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("Model, vectorizer, and scaler saved successfully.")
