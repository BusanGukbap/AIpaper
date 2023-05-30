import firebase_admin
from firebase_admin import credentials, firestore, initialize_app, auth

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
        query = self.user_ref.where('id', '==', id).limit(1).stream()

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

    def get_search_history(self, uid):
        # 검색 기록 가져오기
        doc = self.search_history_ref.document(uid).get()
        if doc.exists:
            return doc.to_dict()
        else:
            return None

    def save_search_history(self, uid, article: dict):
        # article = {'title':str, 'url':str}
        # 검색 기록 저장
        doc = self.search_history_ref.document(uid).get()
        if doc.exists:
            articles = doc.get('articles', [])
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

    def search_news(self, url):
        # url을 통해 기사 검색
        query = self.news_ref.where('articles', 'array_contains', {'url': url}).limit(1).stream()

        for doc in query:
            return doc.to_dict()

        return None

    def save_news(self, news: dict):
        # news = {'title':str, 'url':str, 'article':dict}
        # article = {'origin':str, 'summary':str, 'difficulty':dict}
        # difficulty = {'low':str, 'mid':str, 'high':str}
        # 기사 저장
        doc = self.search_news(news['url'])
        if doc is not None:
            articles = doc.get('articles', [])
            articles.append(news['article'])
            self.news_ref.document(doc['uid']).update({
                'articles': articles
            })