import json
from flask import Blueprint, request
from api.api_utils import json_res
from api.dao import fakedb as fdb
from api.config import DOCTORS_TABLE
from api import db
from api.models import *

doctors_api = Blueprint('doctors', __name__)

@doctors_api.route('', methods=['GET', 'POST'])
def doctors_route():
    if request.method == 'POST':
        req = request.get_json(force=True)
        print(req['firstName'])
        doctor = User(email=req['email'], password=req['password'], firstName=req['firstName'], lastName=req['lastName'], roleID=2)
        db.session.add(doctor)
        db.session.commit()
        return json_res({}, 201)
    else:
        l = []
        doctors = User.query.filter_by(roleID=2).all()
        for doc in doctors:
            doc = doc.__dict__
            doc.pop('_sa_instance_state', None)
            l.append(doc)
        return json_res(l, 200)


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