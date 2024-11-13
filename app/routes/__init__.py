from .main_routes import main_routes  # main_routes 블루프린트를 현재 패키지에 등록

# 외부에서 접근할 수 있도록 모듈에 등록
__all__ = ["main_routes"]