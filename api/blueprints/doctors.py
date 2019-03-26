import json
from flask import Blueprint, request, jsonify
from api import db, ma
from api.api_utils import json_res, query2jsonable
from api.dao.models import User, Role, Interview, Question, Answer
from api.services.email_sender import send_interview

doctors_api = Blueprint('doctors', __name__)

@doctors_api.route('', methods=['GET', 'POST'])
def doctors_route():
    if request.method == 'POST':
        User.insert_into(request.get_json(force=True), 'Doctor')
        return jsonify({}), 201
    else:
        return jsonify({'Doctors': User.get_users_by_role('Doctor')}), 200


@doctors_api.route('/<doctor_id>', methods=['GET', 'PUT', 'DELETE'])
def doctor_route(doctor_id):
    if request.method == 'PUT':
        try: 
            updated = User.update_user(request.get_json(force=True), doctor_id, 'Doctor')
            if updated:
                return jsonify({}), 200
            return jsonify({'error': 'Not found'}), 404
        except Exception:
            return jsonify({'error': 'Bad request'}), 400
    elif request.method == 'DELETE':
        deleted = User.delete_user({}, doctor_id, 'Doctor')
        if deleted:
            return jsonify({}), 201
        return jsonify({'error': 'Not found'}), 404
    else:
        doctor = User.get_users_by_role('Doctor', doctor_id)
        if doctor:
            return jsonify({'Doctor': doctor}), 200
        return jsonify({'error': 'Not found'}), 404


@doctors_api.route('/<doctor_id>/interviews', methods=['GET', 'POST'])
def doctor_route_interviews(doctor_id):
    data = request.get_json(force=True)
    if request.method == 'POST':
        inserted = Interview.insert_into(doctor_id, data)
        if inserted:
            id = data.get('PatientID', '')
            print(User.query.get(id).email)
            send_interview(User.query.get(id).email)
            return jsonify({}, 201)
        else:
            return jsonify({'error': 'Bad request'}), 400
    else:
        interviews = Interview.get_interviews_of_user(doctor_id)
        if interviews:
            return jsonify({'interviews': interviews}), 200
        else:
            return jsonify({'error': 'Not found'}), 404
      

@doctors_api.route('/<doctor_id>/interviews/<interview_id>', methods=['GET', 'PUT', 'DELETE'])
def doctor_route_interview(doctor_id, interview_id):
    if request.method == 'PUT':
        try: 
            updated = Interview.update_interview(doctor_id, interview_id, request.get_json(force=True))
            if updated:
                return jsonify({}), 200
            return jsonify({'error': 'Not found'}), 404
        except Exception:
            return jsonify({'error': 'Bad request'}), 400 
    elif request.method == 'DELETE':
        deleted = Interview.delete_interview(doctor_id, interview_id)
        if deleted:
            return jsonify({}), 204
        else:
            return jsonify({'error': 'Not found'}), 404
    else:
        interview = Interview.get_interviews_of_user(doctor_id, interview_id)
        if interview:
            return jsonify(interview), 200
        return jsonify({'error': 'Not found'}), 404
