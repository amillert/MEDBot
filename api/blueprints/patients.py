from flask import Blueprint, request
from flask import jsonify
from api import db
from api.api_utils import json_res, query2jsonable
from api.dao.models import Role, User, Patient, UserSchema, RoleSchema, Interview
from sqlalchemy.exc import IntegrityError

patients_api = Blueprint('patients', __name__)


@patients_api.route('', methods=['GET', 'POST'])
def patients_route():
    try:
        if request.method == 'POST':
            print(request.get_json(force=True))
            Patient.insert_into(request.get_json(force=True))
            return jsonify({}), 201
        else:
            return jsonify({'patients': Patient.get_all()}), 200
    except IntegrityError:
        return jsonify({'error': 'Patient with the same email adress exists'}), 400

@patients_api.route('/<patient_id>', methods=['GET', 'PUT', 'DELETE', 'PATCH'])
def patient_route(patient_id):
    if request.method == 'PUT' or request.method == 'PATCH':
        try: 
            updated = Patient.update_patient(request.get_json(force=True), patient_id)
            if updated:
                return jsonify({}), 200
            return jsonify({'error': 'Not found'}), 404
        except Exception as e:
            print(e)
            return jsonify({'error': 'Bad request'}), 400
    elif request.method == 'DELETE':
            deleted = Patient.delete_patient(patient_id)
            if deleted:
                return jsonify({}), 204
            return jsonify({'error': 'Not found'}), 404
    else:
        patient = Patient.get_by_id(patient_id)
        if patient:
            return jsonify({'patient': patient}), 200
        return jsonify({'error': 'Not found'}), 404

@patients_api.route('/<patient_id>/interviews', methods=['GET'])
def patient_route_interviews(patient_id):
        interviews = Interview.get_interviews_of_patient(patient_id)
        if interviews:
            return jsonify({'interviews': interviews}), 200
        else:
            return jsonify({'error': 'Not found'}), 404


@patients_api.route('/<patient_id>/interviews/<interview_id>', methods=['GET', 'PUT'])
def patient_route_interview(patient_id, interview_id):
    if request.method == 'PUT':
        updated = Interview.answer_interview(patient_id, interview_id, request.get_json(force=True))
        if updated:
            return jsonify({}), 200
        return jsonify({'error': 'Not found'}), 404
    else:
        interview = Interview.get_interviews_of_patient(patient_id, interview_id)
        if interview:
            return jsonify(interview), 200
        return jsonify({'error': 'Not found'}), 404
