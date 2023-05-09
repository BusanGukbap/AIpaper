import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import json
from back.crawling.Crawling import *
from back.summary.Gpt import *

from flask_cors import CORS
from flask import Flask, jsonify, request, session

app = Flask(__name__)
app.secret_key = 'secret_key'
CORS(app)

crawling = Crawling()
gpt = Gpt()

@app.route('/api/sign_up', methods=['POST'])
def sign_up():
    data = request.get_json()
    id = data['id']
    pw = data['pw']
    try:
        with open(f'./data/user/{id}.json', 'r') as f:
            # 파일이 존재하는 경우 이미 가입한 사용자라는 오류를 반환
            return jsonify({'result': 'User already exists.'})
    except FileNotFoundError:
        # 파일이 존재하지 않는 경우 새로운 파일을 생성하고 사용자 데이터 저장
        user_data = {'id': id, 'pw': pw}
        os.makedirs('./data/user/', exist_ok=True) # user 폴더가 없으면 생성
        with open(f'./data/user/{id}.json', 'w') as f:
            json.dump(user_data, f)
        return jsonify({'result': 'User signed up successfully.'})

@app.route('/api/sign_in', methods=['POST'])
def sign_in():
    data = request.get_json()
    id = data['id']
    pw = data['pw']

    if not os.path.exists(f'./data/user/{id}.json'):
        return jsonify({'result': 'User does not exist'})

    with open(f'./data/user/{id}.json', 'r') as f:
        user_data = json.load(f)
        if user_data['pw'] != pw:
            return jsonify({'result': 'Wrong password'})
        session['id'] = id

    return jsonify({'result': 'login success'})

@app.route('/api/search_article', methods=['GET'])
def search_article():
    keyword = request.args.get('keyword')
    articles = crawling.search_article(keyword)
    # articles = [{'headline':str, 'url':str}, ...]
    return jsonify({'articles': articles})

@app.route('/api/get_summary', methods=['GET'])
def get_summary():
    url = request.args.get('url')
    article = crawling.get_article(url)
    gpt.setmessage(article)
    summary = gpt.getresponse()
    return jsonify({'summary' : summary['choices'][0]['message']['content']})

app.run(host="0.0.0.0", port=5010, debug=True)