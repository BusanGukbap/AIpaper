import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import json
from back.crawling.Crawling import *
from back.summary.Gpt import *

from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)

crawling = Crawling()
gpt = Gpt()

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
    #summary = gpt.setmessage(article)
    return jsonify({'summary' : article})

app.run(host="0.0.0.0", port=5010, debug=True)