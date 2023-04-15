from bs4 import BeautifulSoup
import requests
import json


class Crawling():
    def __init__(self):
        # userinfo
        pass

    def search_article(self, search_term : str) -> None:
        # search_term = 'earthquake'
        search_url = f"https://search.api.cnn.com/content?q={search_term}&size=20&from=0&page=1&sort=newest"
        response = requests.get(search_url)

        articles = []
        if response.status_code == 200:
            with open("response.json", 'w') as f:
                f.write(json.dumps(response.json(), indent='\t'))
            for result in response.json()["result"]:
                if result["type"] == 'article':
                    data = {
                        "headline": result["headline"],
                        "url": result["url"]
                    }
                    articles.append(data)
                    # print(data)
            with open("data.json", "w") as f:
                f.write(json.dumps(articles, indent='\t'))
            return articles
        else:
            print("error: ", response.status_code)
            return -1

    def get_article(self, url: str):
        response = requests.get(url)

        if response.status_code == 200:
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')
            title = soup.select_one('body > div.layout__content-wrapper.layout-with-rail__content-wrapper > section.layout__top.layout-with-rail__top > div.headline.headline--has-lowertext > div.headline__wrapper').get_text().strip()
            body = soup.select_one('body > div.layout__content-wrapper.layout-with-rail__content-wrapper > section.layout__wrapper.layout-with-rail__wrapper > section.layout__main-wrapper.layout-with-rail__main-wrapper > section.layout__main.layout-with-rail__main > article > section > main > div.article__content-container > div.article__content')
            # list the first level children of the body
            children = body.findChildren(recursive=False)
            sub_title = 'INTRO'
            sub_contents = []
            article = {
                'title': title,
                'sections': []
            }
            for child in children:
                if child.name == 'div':
                    # find a tag, 'picture' in the div
                    picture = child.find('picture')
                    video = child.find('video')
                    if picture:
                        caption = child.find('div', 'image__caption').get_text().strip()
                        sub_contents.append('*** IMAGE: {}'.format(caption))
                    elif video:
                        caption = child.find('div', 'video-resource__details').get_text().strip()
                        sub_contents.append('*** VIDEO: {}'.format(caption))

                # 본문을 못 가져오는 에러 원인
                # 각 section들에 소제목이 있다는 전제 하에 리스트를 만드므로 소제목이 없다면 리스트가 생성되지 않음
                # 소제목이 없는 경우 INTRO 처리를 했지만, INTRO가 무시되는 경우가 있음
                elif child.name == 'h2':
                    article['sections'].append({
                        'title': sub_title,
                        'content': '\n'.join(sub_contents)
                    })
                    sub_title = child.get_text().strip()
                    sub_contents = []
                    # print(sub_title)

                elif child.name == 'p':
                    sub_contents.append(child.get_text().strip())
                    # print(child.get_text())


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
    c.get_article(data[0]["url"])