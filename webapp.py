import click
from flask import Flask
from app.routes.main_routes import main_routes

# 애플리케이션 실행 파일
app = Flask(__name__, template_folder="app/templates", static_folder="app/static")  # 템플릿 및 정적 파일 경로 지정

# 블루프린트 등록
app.register_blueprint(main_routes)

@click.command()
@click.option("--host", default="127.0.0.1", help="Host to bind to")
@click.option("--port", default=5000, help="Port to bind to")
def runserver(host, port):
    """Run the Flask application."""
    app.run(host=host, port=port)

if __name__ == "__main__":
    runserver()

