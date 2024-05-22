#워드 클라우드 생성
import base64
import os

def create_cloud(url):
    #워드 클라우드 생성 코드 작성

    # 프로젝트 루트 디렉토리에 있는 더미 이미지 파일 경로
    cloud_image_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dummy_images', 'cloud_image.png')
    




    # 이미지 파일을 읽어 Base64로 인코딩
    with open(cloud_image_path, "rb") as image_file:
        cloud_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    return {
        "cloud": cloud_image,
    }