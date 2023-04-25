import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import json
from back.crawling.Crawling import *
from back.summary.Gpt import *

from flask_cors import CORS
from flask import Flask, request

app = Flask(__name__)
CORS(app)

crawling = Crawling()
#gpt = Gpt()

def get_headlines(articles : list):
    # url과 headline이 같이 묶여있는 list를 받으면, headline만 뽑아서 headline_list로 return
    # articles는 list로 url_and_headline을 가짐, url_and_headline은 dict로 url과 headline을 key로 가짐
    headlines = []
    for url_and_headline in articles:
        headlines.append(url_and_headline['headline'])
    return headlines

def get_article_url(articles: list, index : int):
    # index로 url을 찾아서 return
    url_and_headline = articles[index]
    url = url_and_headline['url']
    return url

@app.route('/api/hello', methods=['POST'])
def hello():
    data = request.get_json()
    name = data['name']
    return {'message': f'Hello, {name}!'} 

@app.route('/api/search_article', methods=['POST'])
def search_article():
    data = request.get_json()
    keyword = data['keyword']
    articles = crawling.search_article(keyword)
    headlines = get_headlines(articles)
    url = []
    for arti in articles:
        url.append(arti['url'])

#    url = get_article_url(headlines, index)
    return {'headlines': headlines, 'url' : url}

@app.route('/api/get_summary', methods=['POST']) # 플라스크가 리액트로 headlines 주고, 리액트가 플라스크로 선택된 index를 줌
def get_summary():
    data = request.get_json()
    index = data['index']
    url = data['url']
    article = crawling.get_article(url)
    gpt = Gpt(article)
    summary = gpt.getresponse()
    return {'summary' : summary} #리액트로 요약 보내기
    #return 0 


app.run(host="0.0.0.0", port=5010)