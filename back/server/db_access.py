import firebase_admin
from firebase_admin import credentials, firestore, initialize_app, auth

class DatabaseAccess:

    def __init__(self, firebase_key):
        # Firebase Admin SDK 초기화
        cred = credentials.Certificate(firebase_key)
        default_app = initialize_app(cred)
        self.db = firestore.client()
        self.user_ref = self.db.collection('Users')

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

