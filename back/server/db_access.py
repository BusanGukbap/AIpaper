import firebase_admin
from firebase_admin import credentials, firestore, initialize_app, auth
from google.cloud.firestore_v1.base_query import FieldFilter

class DatabaseAccess:

    def __init__(self, firebase_key):
        # Firebase Admin SDK 초기화
        cred = credentials.Certificate(firebase_key)
        default_app = initialize_app(cred)
        self.db = firestore.client()
        self.user_ref = self.db.collection('Users')
        self.search_history_ref = self.db.collection('search_history')
        self.news_ref = self.db.collection('news')

    def generate_uid(self):
        # uid 생성
        return auth.create_user().uid

    def save_user(self, uid, id, pw):
        # 사용자 정보 저장
        self.user_ref.document(uid).set({
            'uid': uid,
            'id': id,
            'pw': pw,
        })
        return uid

    def get_user_by_id(self, id):
        # 중복 아이디 검사를 위한 회원정보 가져오기
        query = self.user_ref.where(filter=FieldFilter('id', '==', id)).limit(1).stream()

        for user in query:
            return user.to_dict()

        return None

    def get_user_for_check(self, id, pw):
        # 로그인을 위한 회원정보 가져오기
        user = self.get_user_by_id(id)
        if user is not None:
            if user['pw'] == pw:
                return user

        return None

    def get_search_history(self, uid: str):
        # 검색 기록 가져오기
        doc = self.search_history_ref.document(uid).get()
        if doc.exists:
            return doc.to_dict()
        else:
            return None

    def check_search_history(self, uid: str, url: str):
        # 검색 기록 중복 확인
        doc = self.search_history_ref.document(uid).get()
        articles = doc.get('articles')
        for article in articles:
            if article['url'] == url:
                return True

        return False

    def save_search_history(self, uid, article: dict):
        # article = {'headline':str, 'url':str}
        # 검색 기록 저장
        doc = self.search_history_ref.document(uid).get()
        if doc.exists:
            if self.check_search_history(uid, article['url']):
                return
            articles = doc.get('articles')
            articles.append(article)
            self.search_history_ref.document(uid).update({
                'articles': articles
            })

        else:
            data = {
                'articles': [article],
                'uid': uid
            }
            self.search_history_ref.document(uid).set(data)

    def get_article_by_url(self, url):
        # url을 통해 기사 검색
        query = self.news_ref.where(filter=FieldFilter('url', '==', url)).limit(1).stream()

        for doc in query:
            return doc.to_dict()

        return None

    def save_news(self, news: dict):
        # news = {'headline':str, 'url':str, 'publishedAt':str, 'soruce':str, 'article':dict}
        # article = {'origin':str, 'summary':str, 'difficulty':dict}
        # difficulty = {'easy':str, 'normal':str, 'hard':str}
        # 기사 저장
        doc = self.get_article_by_url(news['url'])
        headline = news['headline']
        if doc is None:
            self.news_ref.document(headline).set(news)