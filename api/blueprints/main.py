import json
import random
import jwt
import datetime
from api.api_utils import json_res
from flask import  Blueprint, request, make_response, jsonify
from api.dao.models import User, Chatbot, Interview, ChatbotSchema, Logs
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
        return jsonify({'token' : token.decode('UTF-8'), 'userID': user.id, "roleID": user.roleID})
    Logs.insert_into({'message': 'Bad login for user ' + user.email, 'status': 'WARN'})
    return jsonify({'error': 'Could not verify'}), 400


@main.route('/changepassword', methods=['PUT'])
def changePassword():
    req = request.get_json(force=True)
    changed = User.changePassword(req)
    if changed:
        return jsonify({'changed': True})
    else:
        return jsonify({'error': 'Error try again'}), 400

@main.route("/<interviewID>/chatbot/<patientID>", methods=['POST'])
def save_chatbot_convo(interviewID, patientID):
    data = request.get_json(force=True)[1:]
    from api import db
    for medbot, user in zip(data[::2], data[1::2]):
        interview = Interview.query.filter_by(id=interviewID).first()
        chat = Chatbot(InterviewID=interviewID, PatientID=patientID, DoctorID=interview.DoctorID, Question=medbot["msg"] , Answer=user["msg"])
        print()
        print("InterviewID: ", chat.InterviewID)
        print("DoctorID: ", chat.DoctorID)
        print("PatientID: ", chat.PatientID)
        print("question: ", chat.Question)
        print("answer: ", chat.Answer)
        print(chat.InterviewID, chat.DoctorID, chat.PatientID, chat.Question, chat.Answer)
        db.session.add(chat)
        db.session.commit()
    print()
    return ""

@main.route("/chatbot/<interviewID>", methods=['GET'])
def get_interview(interviewID):
    from api import db
    chatbot = Chatbot.query.filter_by(InterviewID=interviewID).all()
    chatbot_schema = ChatbotSchema(many=True)
    conversation = chatbot_schema.dump(chatbot)
    return jsonify(conversation), 200