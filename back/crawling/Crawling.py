import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import tokens

from bs4 import BeautifulSoup
import requests
from langdetect import detect
import json
from newsapi import NewsApiClient


class Crawling():

    def search_article(self, serach_term : str, language : str ='en') -> None:
        # Init api
        newsapi = NewsApiClient(api_key=tokens.news_key)
        
        # sort_by: relevancy, popularity, publishedAt
        sources = newsapi.get_everything(q=serach_term, language=language, sort_by='relevancy')

        if sources['status'] == 'ok':
            articles = []
            for article in sources['articles']:
                data = {
                    "headline" : article["title"],
                    "url" : article["url"],
                    "publishedAt" : article["publishedAt"],
                    "source" : article["source"]["name"]
                }
                articles.append(data)
            return articles
        else:
            print("error: ", sources["code"])
            # error message in here
            # https://newsapi.org/docs/errors
            return -1


    def get_article(self, url: str):
        if 'https://edition.cnn.com/' in url:
            response = requests.get(url)

            if response.status_code == 200:
                html = response.text
                soup = BeautifulSoup(html, 'html.parser')
                
                title = soup.find('div', 'headline').get_text()
                body = soup.find('div', 'article__content')

                # list the first level children of the body
                children = body.findChildren(recursive=False)
                article = {
                    'title': title,
                    'sections': []
                }
                for child in children:
                    if child.name == 'h2':
                        article['sections'].append({
                            'title': sub_title,
                            'content': '\n'.join(sub_contents)
                        })
                        sub_title = child.get_text().strip()
                        sub_contents = []

                    elif child.name == 'p':
                        sub_contents.append(child.get_text().strip())

                article['sections'].append({
                    'title': sub_title,
                    'content': '\n'.join(sub_contents)
                })
                return article

                # with open('raw.txt', 'w') as f:
                #     f.write(json.dumps(article, indent='\t'))
                # with open('result.txt', 'w') as f:
                #     f.write('TITLE: {}\n'.format(article['title']))
                #     for section in article['sections']:
                #         f.write('SECTION: {}\n'.format(section['title']))
                #         f.write('{}\n'.format(section['content']))
            else: 
                print(response.status_code)
                return -1
            
            

        else:
        # Not CNN url
            response = requests.get(url)

            if response.status_code == 200:
                html = response.text
                soup = BeautifulSoup(html, 'html.parser')
                
                title = soup.find('h1').get_text()
                body = soup.find_all('p')

                # list the first level children of the body
                article = {
                    'title': title,
                    'sections': []
                }
                for p in body:
                    article['sections'].append(p.text)
                with open('result.txt', 'w') as f:
                    f.write(json.dumps(article, indent='\t'))
                return article
            else:
                print(response.status_code)
                return -1
                


if __name__ == '__main__':
    c = Crawling()
    term = input()
    data = c.search_article(term)

    # print(data[0]["url"])
    # print(data)
    print(c.get_article(data[0]["url"]))
    # print(c.read_webpage('https://www.foxnews.com/us/illinois-interstate-crash-involving-72-vehicles-leaves-six-dead-more-30-injured-horrific'))