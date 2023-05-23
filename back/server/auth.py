from db_access import DatabaseAccess
from flask import Flask, jsonify, request, session

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import tokens

db_access = DatabaseAccess(tokens.firebase_key)

def sign_up():
    if request.method == 'POST':
        id = request.form['id']
        pw = request.form['pw']
        uid = db_access.generate_uid()

    try:
        if db_access.get_user_by_id(id):
            return jsonify({'success': False, 'message': '이미 존재하는 아이디입니다.'})

    
        if db_access.save_user(uid, id, pw):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': '회원가입에 실패했습니다.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

def sign_in():
    if request.method == 'POST':
        id = request.form['id']
        pw = request.form['pw']

        user = db_access.get_user_for_check(id, pw)

        if user:
            session['user'] = user
            return jsonify({'success': True, 'uid': user.uid})
        else:
            return jsonify({'success': False, 'message': '아이디 또는 비밀번호가 틀렸습니다.'})