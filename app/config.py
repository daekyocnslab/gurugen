# 환경 설정 파일

import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Config:
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", 3306))
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")
    VIDEO_FOLDER = os.getenv("VIDEO_FOLDER",
                             os.path.join(os.path.dirname(os.path.abspath(__file__)), 'video'))  # 기본값 설정


config = Config()