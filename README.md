# GURUGEN DENT 프로젝트
 Dent 자동분석 시스템을 위한 웹 프로젝트입니다.



## 업데이트
- **2024-11-14 : 프로젝트 초기 구성 완료
- **2024-11-15 : README.md 수정
- **2024-11-21 : 디자인 1차 반영 및 데이터 불러오기 기능 구현
- **2024-11-22 : 디자인 2차 반영 및 비디오 출력 구현
- **2024-11-25 : 디자인 스타일 및 비디오 경로 수정
- **2024-11-26 : README.md 수정 / 파비콘 및 로고 추가



## 프로젝트 개요
GURUGEN DENT 프로젝트는 차량의 Dent(흠집)를 자동으로 분석하고, 분석 결과를 웹을 통해 제공하는 시스템입니다. Python을 기반으로 구축되었으며, 웹 애플리케이션으로 개발되었습니다.



## 프로젝트 구조

```plaintext
├── app                  - 프로젝트의 메인 애플리케이션 폴더로, 설정 파일, 데이터베이스 연결, 라우트, 정적 파일 등을 포함합니다.
│ ├── config.py          - 애플리케이션의 전역 설정 정보를 관리합니다.
│ ├── db                 - 데이터베이스와 관련된 파일들을 포함합니다.
│ │ ├── connector.py     - 데이터베이스 연결을 담당하는 모듈입니다.
│ │ └── queries.py       - 데이터베이스 쿼리문과 관련된 함수들이 정의되어 있습니다.
│ ├── routes             - 애플리케이션의 라우트(경로)와 관련된 파일들이 위치합니다.
│ │ ├── __init__.py      - routes 폴더를 파이썬 패키지로 인식하게 하는 초기화 파일입니다.
│ │ └── main_routes.py   - 메인 라우트(경로)를 정의합니다.
│ └── static             - 정적 파일(CSS, JS, 이미지, 비디오 등)을 관리하는 폴더입니다.
│   ├── css              - 스타일을 정의한 파일들이 포함된 폴더입니다.
│   ├── fonts            - 폰트 파일이 포함된 폴더입니다.
│   ├── images           - 이미지 파일들이 포함된 폴더입니다.
│   ├── js               - JavaScript 파일들이 포함된 폴더입니다.
│   └── vendor           - 외부 라이브러리(플러그인, 모듈) 파일들이 위치합니다.
└── templates            - HTML 템플릿 파일들이 위치한 폴더입니다.
├── README.md            - GURUGEN DENT 시스템의 개요와 설정 방법을 설명한 문서입니다.
├── .env                 - 환경 변수 파일로, 중요한 설정 정보를 관리합니다.
├── .gitignore           - Git에 포함되지 않을 파일 목록을 지정합니다.
├── requirements.txt     - 프로젝트 실행에 필요한 Python 라이브러리 목록이 포함된 파일입니다.
└── webapp.py            - 웹 애플리케이션의 메인 실행 파일입니다.
```


## Python 버전

GURUGEN DENT 프로젝트는 **Python 3.9.18** 버전을 권장합니다. 프로젝트 호환성을 위해 해당 버전으로 가상 환경을 설정하시길 권장합니다. 


---

## 주요 설정 
### 1. .env 설정
프로젝트에서 사용하는 중요한 환경 변수는 `.env` 파일에 저장하여 관리합니다. 이 파일에는 데이터베이스 연결 정보, 비디오 파일 경로 등 보안상 중요한 설정 정보를 포함할 수 있습니다.

   `.env` 파일 예시:
   ```plaintext
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    VIDEO_FOLDER=your_video_folder
   ```
----
### 2. 로고 이미지 변경
현재 Audi 사의 로고 이미지를 출력하고 있습니다. 추가적으로 Renault 사의 로고 이미지를 변경할 수 있도록 코드를 추가하였습니다.

로고 이미지를 변경하기 위해서는 'sidebar.html'에서 아래의 소스코드를 변경해주시면 됩니다.

    <h1 class="logo"><img class="logoImg" src="../static/images/logo.svg" alt="Audi"></h1>

    <!--르노 이미지로 변경시, 로고의 사이즈 지정은 width와 height 사이즈를 변경해주세요.-->
    <!--<h1 class="logo"><img class="logoImg" src = "../static/images/renault.png" alt="Renault" style="width: 66px; height: 44px;"></h1>-->

만일 새로운 이미지를 출력하려면, 아래의 절차와 같습니다.

#### 1)	새로운 로고 이미지 준비
   - 변경할 로고 이미지를 준비합니다.
   - 형식은 SVG, PNG, JPG 중 하나로 선택할 수 있으며, 파일 이름은 기존의 파일 이름과 동일하게 logo.svg로 설정합니다.
#### 2)	기존 로고 파일 교체
   - 새로 준비한 로고 파일을 기존의 경로 app/static/images/logo.svg에 업로드합니다.
   - 이때, 기존 파일을 덮어쓰기(overwrite)하여 교체합니다.

---

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


4. **웹 애플리케이션 실행**

   - `webapp.py`는 GURUGEN DENT 시스템의 메인 실행 파일입니다. 이 파일을 실행하여 웹 애플리케이션을 시작할 수 있습니다.
   
       ```bash
        python webapp.py
       ```

    - 특정 호스트와 포트를 설정하려면:
       ```bash
        python webapp.py --host=0.0.0.0 --port=8080(포트번호)
       ```

     애플리케이션을 종료하려면 터미널에서 Ctrl + C를 눌러 서버를 중지합니다.

---

## 백그라운드에서 웹 애플리케이션 실행
- 웹 애플리케이션을 백그라운드에서 실행하며, 터미널 세션 종료 후에도 계속 실행되도록 설정하려면:
   ```bash
    nohup python webapp.py --host=0.0.0.0 --port=8080&(포트번호)
   ```
    
 만일, 애플리케이션을 중지하려면 해당 프로세스를 종료합니다.
1) 프로세스 확인
   ```bash
    ps aux | grep webapp.py
   ```
2) 프로세스 종료
     ```bash
     kill <PID>
    ```
   강제종료가 필요하다면,  
     ```bash
     kill -9 <PID>
    ```

---

### 주요 수정 내용 요약
- Python 버전을 **3.9.18**로 수정.
- 가상환경 이름을 "venv"로 일관되게 사용.
- 포트 설정 설명을 구체화.
- `.env` 파일 변수의 용도를 명확히 설명.
- 명확성과 가독성을 높이기 위해 단계별 설명을 보완.
- 애플리케이션 실행 방법 보완.
