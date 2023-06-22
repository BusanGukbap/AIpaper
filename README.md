# AIpaper
종합설계프로젝트1 강의 중 "대규모 인공지능 언어모델을 이용한 서비스 개발" 과제를 수행한 결과물입니다.

*Member: **김동윤**, 김수호, 김주형, 장우석*
<br>

## 1. 서비스 개요

![systemArch](./images/aipaper_system_architecture.png)


## 2. 주요 기능

![main1](./images/mainpage1.png)
home 화면

![signin](./images/signin.png)
로그인 페이지 화면

![signup](./images/signup.png)
회원가입 페이지 화면

![main2](./images/mainpage2.png)
로그인 후 home 화면, login -> logout으로 변경됨

![search](./images/searchpage.png)
키워드 검색 후 키워드에 해당하는 기사들 목록을 보여주는 페이지

![summary](./images/summarypage.png)
기사 클릭 후 기사 요약을 보여주는 페이지

![easy](./images/easypage.png)
기사 요약 중 easy를 골랐을 때

![normal](./images/normalpage.png)
기사 요약 중 normal을 골랐을 때

![hard](./images/hardpage.png)
기사 요약 중 hard를 골랐을 때

![history](./images/historypage.png)
History 버튼을 누르면 나오는 페이지
유저가 로그인 후 보았던 기사들의 기록을 담아놓음



## 3. 사용 기술
> Front-end

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black">
<br>

> Back-end

<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/Flask-FFFFFF?style=flat-square&logo=flask&logoColor=black"> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=white"> <img src="https://img.shields.io/badge/GPT3.5-412991?style=flat-square&logo=OpenAI&logoColor=white"> <img src="https://img.shields.io/badge/Google Translate-4285F4?style=flat-square&logo=Google&logoColor=white">
<br>

> 개발 및 배포환경

<img src="https://img.shields.io/badge/GCP-4285F4?style=flat-square&logo=Google&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white">
<br>

## 4. 리포지토리 구조
```bash
AIpaper
├── README.md
├── back
│   ├── credentials.json
│   ├── server.py
│   ├── tokens.py
│   └── utils
│       ├── Crawling.py
│       ├── Gpt.py
│       ├── Translate.py
│       └── db_access.py
└── react-app
    ├── README.md
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── response.json
    └── src
        ├── App.css
        ├── App.js
        ├── App.test.js
        ├── Pages
        │   ├── HistoryPage.js
        │   ├── Home.js
        │   ├── Join.js
        │   ├── Login.js
        │   ├── Summary.js
        │   └── Title.js
        ├── components
        │   ├── Button.js
        │   ├── InputBox.js
        │   └── OutputBox.js
        ├── index.css
        ├── index.js
        ├── logo.svg
        ├── reportWebVitals.js
        └── setupTests.js
```

## 5. 실행 방법
### 5-1. 웹페이지
[**AIpaper**](https://aipaper.site/)
<br>

<a href="https://aipaper.site/"><img src="./images/aipaper_qr.png" width="200" height="200"></a>

<br>

### 5-2. 로컬 실행
1. 백엔드 서버 실행
  * `~/back/`에서 `pip install -r requirements.txt`로 필수 패키지 설치
  * `~/back/`폴더에 `tokens.py`를 추가하여 `gpt-key`, `news-key`, `firebase_key`, `app_key` 세팅
  * `~/back/`폴더에 Google Translation API key를 `credential.json`으로 저장
  * `~/back/`에서 `python server.py`로 실행

2. 프론트엔드 리액트 앱 실행
  * `~/react-app/`에서 `npm install`로 필수 패키지 설치
  * `npm start`로 실행


## 6. 팀원
|이름|역할|
|---|------------------------|
|김동윤|__Front__<br>메인 웹페이지 개발|
|김수호|__Front/Back__<br>Flask 서버 구축, 웹페이지 디자인|
|김주형|__Back/Design__<br>GPT 모델 데이터 처리, 웹페이지 디자인|
|장우석|__Back__<br>Crawling, DB 설계, Flask 서버 구축, 배포|
<br>


