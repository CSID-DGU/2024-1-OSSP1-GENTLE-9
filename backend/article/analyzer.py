#성향 분석 코드
import base64
import os

def analyze_url(url):
    # 프로젝트 루트 디렉토리에 있는 더미 이미지 파일 경로
    # cloud_image_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dummy_images', 'cloud_image.png')
    analysis_image_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dummy_images', 'analysis_image.png')
    
    # # 이미지 파일을 읽어 Base64로 인코딩
    # with open(cloud_image_path, "rb") as image_file:
    #     cloud_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    with open(analysis_image_path, "rb") as image_file:
        analysis_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    return {
        "analysis": analysis_image,
        "isscrape": False
    }
