from flask import Blueprint, request
from api.api_utils import json_res
from api.dao import fakedb as db
from api.config import PATIENTS_TABLE

patients_api = Blueprint('patients', __name__)

@patients_api.route('', methods=['GET', 'POST'])
def patients_route():
    if request.method == 'POST':
        patient = request.get_json(force=True)
        db.create(PATIENTS_TABLE, patient)
        return json_res({}, 201)
    else:
        return json_res(db.get_all(PATIENTS_TABLE), 200)


@patients_api.route('/<patient_id>', methods=['GET', 'PUT', 'DELETE'])
def patient_route(patient_id):
    if request.method == 'PUT':
        patient = request.get_json(force=True)
        if patient.get('id', '') != patient_id:
            return json_res({'error': 'Bad request'}, 400)
        res = db.update(PATIENTS_TABLE, patient)
        return json_res({}, 200) if res else json_res({'error': 'Not found'}, 404)
    elif request.method == 'DELETE':
        res = db.delete(PATIENTS_TABLE, patient_id)
        return json_res({}, 204) if res else json_res({'error': 'Not found'}, 404)
    else:
        patient = db.get(PATIENTS_TABLE, patient_id)
        return json_res(patient, 200) if patient is not None else json_res({'error': 'Not found'}, 404)