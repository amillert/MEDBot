from flask import Blueprint, request
from api_utils import json_res
from dao import fakedb as db
from config import DOCTORS_TABLE

doctors_api = Blueprint('doctors', __name__)

@doctors_api.route('', methods=['GET', 'POST'])
def doctors_route():
    if request.method == 'POST':
        doctor = request.get_json(force=True)
        db.create(DOCTORS_TABLE, doctor)
        return json_res({}, 201)
    else:
        return json_res(db.get_all(DOCTORS_TABLE), 200)


@doctors_api.route('/<doctor_id>', methods=['GET', 'PUT', 'DELETE'])
def doctor_route(doctor_id):
    if request.method == 'PUT':
        doctor = request.get_json(force=True)
        if doctor.get('id', '') != doctor_id:
            return json_res({'error': 'Bad request'}, 400)
        res = db.update(DOCTORS_TABLE, doctor)
        return json_res({}, 200) if res else json_res({'error': 'Not found'}, 404)
    elif request.method == 'DELETE':
        res = db.delete(DOCTORS_TABLE, doctor_id)
        return json_res({}, 204) if res else json_res({'error': 'Not found'}, 404)
    else:
        doctor = db.get(DOCTORS_TABLE, doctor_id)
        return json_res(doctor, 200) if doctor is not None else json_res({'error': 'Not found'}, 404)