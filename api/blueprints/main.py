import json
import jwt
import datetime
from api.api_utils import json_res
from flask import  Blueprint, request, make_response, jsonify
from api.dao.models import User
from werkzeug.security import check_password_hash, generate_password_hash
from api.config import BaseConfig
main = Blueprint('main', __name__)

@main.route('/')
@main.route('/home', methods=['GET'])
def index():
    return json_res({'index': 'hello world'}, 200)

@main.route('/authenticate', methods=['POST'])
def auth():
    req = request.get_json(force=True)
    user = User.query.filter_by(email=req['email']).first()
    if not user:
        return jsonify({'error': 'Could not verify'}), 404

    if check_password_hash(user.password, req['password']):
        if user.passwordChange <= datetime.datetime.now():
            return jsonify({'userID': user.id, 'passwordchange': True})
        token = jwt.encode({'user_id' : user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, BaseConfig.SECRET_KEY, algorithm='HS256')
        print(user.id, user.roleID)
        return jsonify({'token' : token.decode('UTF-8'), 'userID': user.id, "roleID": user.roleID})
        
    return jsonify({'error': 'Could not verify'}), 400
    
@main.route('/changepassword', methods=['PUT'])
def changePassword():
    req = request.get_json(force=True)
    changed = User.changePassword(req)
    if changed:
        return jsonify({'changed': True})
    else:
        return jsonify({'error': 'Error try again'}), 400