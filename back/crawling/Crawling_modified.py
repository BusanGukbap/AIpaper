from bs4 import BeautifulSoup
import requests
from langdetect import detect
import json
from newsapi import NewsApiClient


class Crawling():
    def __init__(self):
        # userinfo
        pass


    def read_webpage(self, url):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'accpet': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            # 'accept-encoding': 'gzip, deflate, br',
            'referer': 'https://www.google.com/',
            'accept-language': 'ko,en-US;q=0.9,en;q=0.8'
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')

            # get the title
            title = soup.select_one('title').get_text().strip()

            # get the language
            meta_tag = soup.find('meta', {'charset': True})
            charset = meta_tag['charset']

            # get the body
            body = soup.select_one('body')
            
            # list the first level children of the body
            children = body.findChildren()
            content = []
            text_content = ''
            for child in children:
                if child.name in ['h1', 'h2', 'h3', 'h4', 'p']:
                    content.append({
                        'type': child.name,
                        'text': child.get_text().strip()
                    })
                    text_content += child.get_text().strip() + '\n'
            
            language = detect(text_content)

            print("Charset: ", charset)
            print("Language: ", language)

            return {
                'result': 'success',
                'language': language,
                'title': title,
                'content': content
            }
        else:
            return {
                'result': 'error',
                'status_code': response.status_code,
                'err_msg': response.text
            } 

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



    # CNN only
    def search_article_CNN(self, search_term : str) -> None:
        search_url = f"https://search.api.cnn.com/content?q={search_term}&size=10&from=0&page=1&sort=newest&type=article"
        response = requests.get(search_url)

        with open("search_result.json", "w") as f:
            json.dump(response.json(), f, indent=4)

        articles = []
        if response.status_code == 200:
            for result in response.json()["result"]:
                data = {
                    "headline": result["headline"],
                    "url": result["url"],
                    "publishedAt": result["lastPublishDate"],
                    "source": result["source"]
                }
                articles.append(data)
            return articles
        else:
            print("error: ", response.status_code)
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
                sub_title = 'INTRO'
                sub_contents = []
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
                sub_title = 'INTRO'
                sub_contents = []
                article = {
                    'title': title,
                    'sections': []
                }
                for p in body:
                    sub_contents.append(p.text)
                article['sections'].append({
                    'title': sub_title,
                    'content': '\n'.join(sub_contents)
                })
                return article
            else:
                print(response.status_code)
                return -1
                


if __name__ == '__main__':
    c = Crawling()
    term = input()
    data = c.search_article_CNN(term)
    # print(data[0]["url"])
    print(data)
    # print(c.get_article(data[0]["url"]))
    # print(c.read_webpage('https://www.foxnews.com/us/illinois-interstate-crash-involving-72-vehicles-leaves-six-dead-more-30-injured-horrific'))