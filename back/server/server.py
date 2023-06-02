import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import tokens

import json
from crawling.Crawling import *
from summary.Gpt import *
from translate.translate import *
from db_access import DatabaseAccess

from flask_cors import CORS
from flask import Flask, jsonify, request, session

app = Flask(__name__)
CORS(app)

crawling = Crawling()
gpt = Gpt()
translator_ = translator('../credentials.json')
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
        requests = json.loads(request.data)
        id = requests['id']
        pw = requests['pw']

        try:
            user = db_access.get_user_for_check(id, pw)

            if user is not None:
                return jsonify({'success': True, 'uid': user['uid'], 'message': '로그인에 성공했습니다.'})
            else:
                return jsonify({'success': False, 'message': '아이디 또는 비밀번호가 틀렸습니다.'})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)})
    return jsonify({'success': False, 'message': '잘못된 접근입니다.'})

@app.route('/api/article', methods=['GET'])
def article():
    keyword = request.args.get('keyword')
    articles = crawling.search_article(keyword)
    # articles = [{'headline':str, 'url':str, 'publishedAt':str, 'source':str}, ...]
    return jsonify({'articles': articles})

@app.route('/api/summary', methods=['POST'])
def summary():
    if request.method == 'POST':
        # data = {
        #     "headline" : article["title"],
        #     "url" : article["url"],
        #     "publishedAt" : article["publishedAt"],
        #     "source" : article["source"]["name"]
        # }
        
        # db에서 url이 있는지 확인 후 있으면 db에서 가져오고 없으면
        # gpt로 요청 후 db에 저장 그 이후 반환
        # db에 data 유무는 if 분기로 함수 분리해서 처리
        requests = json.loads(request.data)
        url = requests['url']

        db_article = db_access.get_article_by_url(url)

        if db_article is None:
            # news = {'headline':str, 'url':str, 'publishedAt':str, 'soruce':str, 'article':dict}
            # article = {'origin':str, 'summary':str, 'difficulty':dict}
            # difficulty = {'easy':str, 'normal':str, 'hard':str}
            # response = {'summary':summary, 'difficulty': difficulty}
            origin = crawling.get_article(url)['sections']
            gpt.setmessage(origin)
            response = gpt.all_response()
            response['origin'] = origin
            requests['article'] = response
            db_access.save_article(requests)
            db_article = requests
        
    return jsonify({'summary' : db_article['article']['summary'], 'difficulty' : db_article['article']['difficulty']})

@app.route('/api/translation', methods=['POST'])
def translation():
    text = request.get_json()['text']
    result = translator_.getresult(text)
    return jsonify({'result' : result['translatedText']}) 

app.run(host="0.0.0.0", port=5010, debug=True)
