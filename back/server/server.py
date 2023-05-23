import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import tokens

import json
from crawling.Crawling import *
from summary.Gpt import *
from translate.translate import *

from flask_cors import CORS
from flask import Flask, jsonify, request, session

from firebase_admin import firestore, auth, credentials, initialize_app

cred = credentials.Certificate(tokens.firebase_key)
default_app = initialize_app(cred)

app = Flask(__name__)
CORS(app)

crawling = Crawling()
gpt = Gpt()
translator_ = translator()

@app.route('/api/sign_up', methods=['POST'])
def sign_up():
    data = request.get_json()
    id = data['id']     # 추후 이메일로 변경 필요
    pw = data['pw']

    try:
        user = auth.create_user(
            email=id,
            password=pw
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    

@app.route('/api/sign_in', methods=['POST'])
def sign_in():
    data = request.get_json()
    id = data['id']     # 추후 이메일로 변경 필요
    pw = data['pw']

    try:
        user = auth.get_user_by_email(id)
        if user:
            auth.sign_in_with_email_and_password(id, pw)
            return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


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
    #post해서 값을 받아온 다음 정하기
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
