from bs4 import BeautifulSoup
import requests
import json


class Crawling():
    def __init__(self):
        # userinfo
        pass

    def search_article(self, search_term : str) -> None:
        search_url = f"https://search.api.cnn.com/content?q={search_term}&size=10&from=0&page=1&sort=newest&type=article"
        response = requests.get(search_url)

        with open("search_result.json", "w") as f:
            json.dump(response.json(), f, indent=4)

        articles = []
        if response.status_code == 200:
            for result in response.json()["result"]:
                data = {
                    "headline": result["headline"],
                    "url": result["url"]
                }
                articles.append(data)
            return articles
        else:
            print("error: ", response.status_code)
            return -1

    def get_article(self, url: str):
        response = requests.get(url)

        if response.status_code == 200:
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')
            
            title = soup.find('div', 'headline').get_text()
            print(title)
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

            with open('raw.txt', 'w') as f:
                f.write(json.dumps(article, indent='\t'))
            with open('result.txt', 'w') as f:
                f.write('TITLE: {}\n'.format(article['title']))
                for section in article['sections']:
                    f.write('SECTION: {}\n'.format(section['title']))
                    f.write('{}\n'.format(section['content']))

            with open('raw.txt', 'w') as f:
                f.write(json.dumps(article, indent='\t'))

            return article

        else :
            print(response.status_code)
            return -1


if __name__ == '__main__':
    c = Crawling()
    term = input()
    data = c.search_article(term)
    print(data[0]["url"])
    print(c.get_article(data[0]["url"]))