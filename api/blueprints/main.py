import json
import jwt
import datetime
from api.api_utils import json_res
from flask import  Blueprint, request, make_response, jsonify
from api.dao.models import User
from werkzeug.security import check_password_hash, generate_password_hash
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
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
    print(generate_password_hash(req['password'], method='sha256'))

    if check_password_hash(user.password, req['password']):
        print('generate token')
        token = jwt.encode({'user_id' : user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, 'secret', algorithm='HS256')
        return jsonify({'token' : token.decode('UTF-8')})
    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
    