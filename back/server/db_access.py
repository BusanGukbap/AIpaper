import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

class DatabaseAccess:

    def __init__(self, firebase_key):
        # Firebase Admin SDK 초기화
        cred = credentials.Certificate(firebase_key)
        default_app = initialize_app(cred)
        self.db = firestore.client()
        self.user_ref = self.db.collection('Users')

    def generate_uid():
        # uid 생성
        return firebase_admin.auth.create_user().uid

    def save_user(self, uid, id, pw):
        # 사용자 정보 저장
        user_ref.document(uid).set({
            'uid': uid,
            'id': id,
            'pw': pw,
        })

    def get_user_by_id(self, id):
        # 중복 아이디 검사를 위한 회원정보 가져오기
        query = user_ref.where('id', '==', id).limit(1).stream()

        for user in query:
            return user

        return None

    def get_user_for_check(self, id, pw):
        # 로그인을 위한 회원정보 가져오기
        query = user_ref.where('id', '==', id).where('pw', '==', pw).limit(1).stream()

        for user in query:
            return user

        return None

