# GURUGEN DENT 프로젝트
 Dent 자동분석 시스템을 위한 웹 프로젝트입니다.



## 업데이트
- **2024-11-14 : 프로젝트 초기 구성 완료



## 프로젝트 개요
GURUGEN DENT 프로젝트는 차량의 Dent(흠집)를 자동으로 분석하고, 분석 결과를 웹을 통해 제공하는 시스템입니다. Python을 기반으로 구축되었으며, 웹 애플리케이션으로 개발되었습니다.



## 프로젝트 구조

```plaintext
├── README.md           - GURUGEN DENT 자동분석 시스템의 개요와 설정 방법을 설명합니다.
├── app                 - 웹 애플리케이션의 주요 로직이 포함된 디렉토리입니다.
├── .env                - 환경 변수 파일로, 중요한 설정 정보를 저장합니다.
├── .gitignore          - Git에 포함되지 않을 파일 목록을 지정합니다.
├── requirements.txt    - 프로젝트 실행에 필요한 Python 라이브러리 목록입니다.
└── webapp.py           - 웹 애플리케이션의 메인 실행 파일입니다.
```



## Python 버전

GURUGEN DENT 프로젝트는 **Python 3.9.18** 버전을 권장합니다. 프로젝트 호환성을 위해 해당 버전으로 가상 환경을 설정하시길 권장합니다. 




## 환경 설정 및 실행 방법

1. **가상환경(venv) 구축**  
   프로젝트의 격리된 환경을 설정하기 위해 가상 환경을 생성합니다.
   ```bash
    python -m venv venv
    ```

2. **가상환경 활성화**

   생성한 가상 환경을 활성화하여 의존성을 설치하고 실행할 수 있도록 준비합니다.

- **Windows**
  ```bash
   .\venv\Scripts\activate
  ```
- **MacOS/Linux**
  ```bash
   source ./venv/bin/activate
  ```
  
   가상 환경이 활성화되면 (venv)이라는 프롬프트가 표시되며, 가상 환경 내에서 작업 중임을 알 수 있습니다.
   가상 환경을 비활성화하려면 다음 명령어를 사용하세요.
  ```bash
   deactivate
  ```

3. **필수 라이브러리 설치**

    가상 환경이 활성화된 상태에서 `requirements.txt` 파일을 사용하여 프로젝트 실행에 필요한 라이브러리를 설치합니다.

   ```bash
    pip install -r requirements.txt
   ```


4. **환경 변수 설정**

    프로젝트에서 사용하는 중요한 환경 변수는 `.env` 파일에 저장하여 관리합니다. 이 파일에는 데이터베이스 연결 정보, 비밀 키 등 보안상 중요한 설정 정보를 포함할 수 있습니다.

   `.env` 파일 예시:
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   SECRET_KEY=your_secret_key
   ```


5. **웹 애플리케이션 실행**

    `webapp.py`는 GURUGEN DENT 시스템의 메인 실행 파일입니다. 이 파일을 실행하여 웹 애플리케이션을 시작할 수 있습니다.
   
   ```bash
    python webapp.py
   ```


   특정 호스트와 포트를 설정하려면:
   ```bash
    python webapp.py --host=0.0.0.0 --port=8080(포트번호)
   ```
   
애플리케이션을 종료하려면 터미널에서 Ctrl + C를 눌러 서버를 중지합니다.



### 주요 수정 내용 요약
- Python 버전을 **3.9.18**로 수정.
- 가상환경 이름을 "venv"로 일관되게 사용.
- 포트 설정 설명을 구체화.
- `.env` 파일 변수의 용도를 명확히 설명.
- 명확성과 가독성을 높이기 위해 단계별 설명을 보완.
