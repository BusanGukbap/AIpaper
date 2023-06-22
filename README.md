# AIpaper
종합설계프로젝트1 강의 중 "대규모 인공지능 언어모델을 이용한 서비스 개발" 과제를 수행한 결과물입니다.

*Member: **김동윤**, 김수호, 김주형, 장우석*
<br>

## 0. 목차
1. [서비스 개요](#1-서비스-개요)
2. [주요 기능](#2-주요-기능)
3. [사용 기술](#3-사용-기술)
4. [리포지토리 구조](#4-리포지토리-구조)
5. [실행 방법](#5-실행-방법)
    1. [웹 페이지](#5-1-웹페이지)
    2. [로컬 실행](#5-2-로컬-실행)
6. [팀원](#6-팀원)
---
## 1. 서비스 개요

 Chat GPT가 출시된 이후 큰 관심을 받았고 이를 이용하여 비전문가도 AI기술에 쉽게 접하고 편하게 사용할 수 있는 서비스를 제공하고자 하였다.

현재 대학수학능력평가 영어 영역에서 학생들에게 요구하는 것은 주로 문맥파악 등과 같은 독해력이다. 보통 지문 하나를 주고 중심내용파악, 맥락 파악 등을 요구하는데 이를 위해서는 적당한 길이의 지문이 필요했고 여기서 우리가 생각한 지문의 source는 영어 신문 기사였다. 그러나 일반적인 해외 기사들은 본문 내용이 너무 길었고 이를 해결할 한 문단 수준으로 압축할 필요가 있었다. 또한, 처음부터 영자 신문을 접하면 어려움을 느낄 수 있기 때문에 난이도 조절 기능이 필요하다고 생각하였다.

![systemArch](./images/aipaper_system_architecture.png)

위 그림은 시스템 아키텍처인데 향후 모바일 환경으로의 확장성을 위해 ReactJS를 사용하였고 이를 배포하기 위해 NGINX를 사용하였다. 기능 구현을 위한 백엔드 서버는 Python Flask를 사용하였고, 대부분의 기능은 외부 api를 사용하였다. 이를 GCP환경의 VM 인스턴스에 올려서 배포하였고 SSL 보안인증을 하여 유저가 브라우저를 통해 접할 수 있도록 하였다.


## 2. 주요 기능

> 로그인 기능
> 
![signin](./images/signin.png)
로그인 페이지 화면

![signup](./images/signup.png)
회원가입 페이지 화면
* 사용자의 열람 기록 확인을 위한 로그인 기능 구현

<br>

> 검색 및 기사 열람

![search](./images/searchpage.png)
키워드 검색 후 키워드에 해당하는 기사들 목록을 보여주는 페이지

![summary](./images/summarypage.png)
기사 클릭 후 기사 요약을 보여주는 페이지

* 메인 페이지에서 키워드를 검색하여 뉴스 기사를 찾아볼 수 있음
* 사용자가 기사를 선택하면 기사 요약문을 제공함

<br>

> 기사 내용 난이도 조절

![easy](./images/easypage.png)
기사 요약 중 easy를 골랐을 때

![normal](./images/normalpage.png)
기사 요약 중 normal을 골랐을 때

![hard](./images/hardpage.png)
기사 요약 중 hard를 골랐을 때

* 요약한 기사내용을 easy, normal, hard로 난이도를 조절하여 제공

<br>

> 사용자 열람 기록 제공

![history](./images/historypage.png)
History 버튼을 누르면 나오는 페이지

* 유저가 로그인 후 보았던 기사들의 기록을 담아놓음

<br>

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
|김동윤|__팀장/Front__<br>메인 웹페이지 개발|
|김수호|__Front/Back__<br>Flask 서버 구축, 웹페이지 디자인|
|김주형|__Back/Design__<br>GPT 모델 데이터 처리, 웹페이지 디자인|
|장우석|__Back__<br>Crawling, DB 설계, Flask 서버 구축, 배포|
<br>


