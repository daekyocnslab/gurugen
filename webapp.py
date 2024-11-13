from flask import Flask
from app.routes.main_routes import main_routes

# 애플리케이션 실행 파일
app = Flask(__name__, template_folder="app/templates", static_folder="app/static")  # 템플릿 및 정적 파일 경로 지정

# 블루프린트 등록
app.register_blueprint(main_routes)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)