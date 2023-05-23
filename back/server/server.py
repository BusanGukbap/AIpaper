import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import tokens

import json
from crawling.Crawling import *
from summary.Gpt import *
from login import *

from flask_cors import CORS
from flask import Flask, jsonify, request, session


app = Flask(__name__)
app.secret_key = 'secret_key'
CORS(app)

crawling = Crawling()
gpt = Gpt()

@app.route('/api/sign_up', view_func=sign_up, methods=['POST'])
@app.route('/api/sign_in', view_func=sign_in, methods=['POST'])


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
