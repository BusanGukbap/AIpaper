import tokens

import json
from utils.Crawling import *
from utils.Gpt import *
from utils.Translate import *
from db_access import DatabaseAccess

from flask_cors import CORS
from flask import Flask, jsonify, request, session, make_response

app = Flask(__name__)
app.secret_key = tokens.app_key
CORS(app, supports_credentials=True)

crawling = Crawling()
gpt = Gpt()
translator_ = translator('./credentials.json')
db_access = DatabaseAccess(tokens.firebase_key)


@app.route('/api/sign_up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        requests = json.loads(request.data)
        id = requests['id']
        pw = requests['pw']
        uid = db_access.generate_uid()

        try:
            if db_access.get_user_by_id(id):
                return jsonify({'success': False, 'message': '이미 존재하는 아이디입니다.'})

            if db_access.save_user(uid, id, pw):
                return jsonify({'success': True})
            else:
                return jsonify({'success': False, 'message': '회원가입에 실패했습니다.'})
                
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)})
    return jsonify({'success': False, 'message': '잘못된 접근입니다.'})

@app.route('/api/sign_in', methods=['POST'])
def sign_in(): 
    if request.method == 'POST': 
        requests = request.get_json()
        id = requests['id'] 
        pw = requests['pw'] 

        try: 
            user = db_access.get_user_for_check(id, pw) 

            if user is not None: 
                # 로그인 성공한 경우 세션 및 쿠키 설정
                session['session_id'] = user['uid']  # 세션에 사용자 정보 저장
                resp = jsonify({'success': True, 'uid': user['uid'], 'message': '로그인에 성공했습니다.'})
                resp.set_cookie('session_id', user['uid'], path='/api')  # 클라이언트에 쿠키 설정
                return resp
            else: 
                return jsonify({'success': False, 'message': '아이디 또는 비밀번호가 틀렸습니다.'}) 
        except Exception as e: 
            return jsonify({'success': False, 'message': str(e)}) 
    return jsonify({'success': False, 'message': '잘못된 접근입니다.'})

@app.route('/api/sign_out', methods=['GET'])
def sign_out():
    session_id = request.cookies.get('session_id')
    if session_id is not None:
        session.pop('session_id', None)
        resp = jsonify({'success': True, 'message': '로그아웃에 성공했습니다.'})
        resp.set_cookie('session_id', '', expires=0)
        return resp
    return jsonify({'success': False, 'message': '잘못된 접근입니다.'})

@app.route('/api/article', methods=['GET'])
def article():
    keyword = request.args.get('keyword')
    articles = crawling.search_article(keyword)
    # articles = [{'headline':str, 'url':str, 'publishedAt':str, 'source':str}, ...]
    return jsonify({'articles': articles})

@app.route('/api/summary', methods=['POST', 'GET'])
def summary():
    session_id = request.cookies.get('session_id')
    if request.method == 'POST':
        # data = {
        #     "headline" : article["title"],
        #     "url" : article["url"],
        #     "publishedAt" : article["publishedAt"],
        #     "source" : article["source"]["name"]
        # }
        
        requests = request.get_json()
        url = requests['url']

        db_article = db_access.get_article_by_url(url)

        if db_article is None:
            # news = {'headline':str, 'url':str, 'publishedAt':str, 'soruce':str, 'article':dict}
            # article = {'origin':str, 'summary':str, 'difficulty':dict}
            # difficulty = {'easy':str, 'normal':str, 'hard':str}
            # response = {'summary':summary, 'difficulty': difficulty}
            article = crawling.get_article(url)
            gpt.setmessage(article)
            response = gpt.all_response()
            origin = article['sections']
            requests['article'] = {
                'origin': origin,
                'summary': response['summary'],
                'difficulty': response['difficulty']
            }
            db_access.save_news(requests)
            db_article = requests

    if request.method == 'GET':
        url = request.args.get('url')
        db_article = db_access.get_article_by_url(url)
        
    if session_id:
        data = {
            'url': url,
            'headline': db_article['headline']
        }
        db_access.save_search_history(session_id, data)

    return jsonify({'summary' : db_article['article']['summary'], 'difficulty' : db_article['article']['difficulty']})


@app.route('/api/translation', methods=['POST'])
def translation():
    text = request.get_json()['text']
    result = translator_.getresult(text)
    return jsonify({'result' : result['translatedText']}) 

@app.route('/api/history', methods=['POST'])
def history():
    session_id = request.cookies.get('session_id')
    if request.method == 'POST':
        if session_id:
            user_history = db_access.get_search_history(session_id)
            if user_history is None:
                return jsonify({'success': False, 'message': '검색 기록이 없습니다.'})
            return jsonify({'success': True, 'history': user_history})

        else:
            return jsonify({'success': False, 'message': '로그인이 필요합니다.'})

app.run(host="0.0.0.0", port=5010, debug=True)
