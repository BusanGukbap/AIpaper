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
    # articles = [{'headline':str, 'url':str}, ...]
    return jsonify({'articles': articles})

@app.route('/api/summary', methods=['GET'])
def summary():
    url = request.args.get('url')
    article = crawling.get_article(url)
    gpt.setmessage(article)
    summary = gpt.getresponse()
    return jsonify({'summary' : summary['choices'][0]['message']['content']})

@app.route('/api/difficulty', methods=['POST'])
def difficulty():
    difficulty = request.get_json()['difficulty']
    if difficulty == 'easy':
        summary = gpt.lower_difficulty()
    elif difficulty == 'hard':
        summary = gpt.raise_difficulty()
    return jsonify({'result' : summary['choices'][0]['message']['content']})

@app.route('/api/translation', methods=['POST'])
def translation():
    text = request.get_json()['text']
    result = translator_.getresult(text)
    return jsonify({'result' : result['translatedText']}) 

app.run(host="0.0.0.0", port=5010, debug=True)
