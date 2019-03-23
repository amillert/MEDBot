from flask import Blueprint, request
from api.api_utils import json_res, query2jsonable
from api.models import User, Role
from api import db

patients_api = Blueprint('patients', __name__)


@patients_api.route('', methods=['GET', 'POST'])
def patients_route():
     if request.method == 'POST':
        req = request.get_json(force=True)
        patient = User(email=req['email'], password=req['password'], firstName=req['firstName'], lastName=req['lastName'], roleID=Role.get_id_by_role('Patient'))
        db.session.add(patient)
        db.session.commit()
        return json_res({}, 201)
     else:
        role = Role.query.filter_by(name='Patient').first()
        return json_res(query2jsonable(role.users), 200)


@patients_api.route('/<patient_id>', methods=['GET', 'PUT', 'DELETE'])
def patient_route(patient_id):
    if request.method == 'PUT':
        try: 
            patient = User.query.filter_by(id=patient_id).update(dict(request.get_json(force=True)))
            if patient == 0:
                return json_res({'error': 'Not found'}, 404)
            db.session.commit()
            return json_res({}, 200)
        except Exception:
            return json_res({'error': 'Bad request'}, 400) 
    elif request.method == 'DELETE':
        patient = User.query.filter_by(id=patient_id).first()
        if patient:
            db.session.delete(patient)
            db.session.commit()
            return json_res({}, 204)
        else:
            return json_res({'error': 'Not found'}, 404)
    else:
        patient = User.query.filter_by(id=patient_id, roleID=Role.get_id_by_role('Patient')).all()
        if patient:
            return json_res(query2jsonable(patient), 200) 
        else:
            return json_res({'error': 'Not found'}, 404)