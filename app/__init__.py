# Flask 애플리케이션 초기화

from flask import Flask
from dotenv import load_dotenv
from app.routes import main_routes
import os

def create_app():
    app = Flask(__name__)

    # 환경 설정 불러오기
    app.config.from_pyfile('config.py')

    # 블루프린트 등록
    app.register_blueprint(main_routes)

    return app