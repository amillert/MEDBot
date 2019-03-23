import json
from flask import Blueprint, request
from api.api_utils import json_res, query2jsonable
from api import db
from api.models import User, Role

doctors_api = Blueprint('doctors', __name__)

@doctors_api.route('', methods=['GET', 'POST'])
def doctors_route():
    if request.method == 'POST':
        req = request.get_json(force=True)
        doctor = User(email=req['email'], password=req['password'], firstName=req['firstName'], lastName=req['lastName'], roleID=Role.get_id_by_role('Doctor'))
        db.session.add(doctor)
        db.session.commit()
        return json_res({}, 201)
    else:
        role = Role.query.filter_by(name='Doctor').first()
        return json_res(query2jsonable(role.users), 200)


@doctors_api.route('/<doctor_id>', methods=['GET', 'PUT', 'DELETE'])
def doctor_route(doctor_id):
    if request.method == 'PUT':
        try: 
            doctor = User.query.filter_by(id=doctor_id).update(dict(request.get_json(force=True)))
            if doctor == 0:
                return json_res({'error': 'Not found'}, 404)
            db.session.commit()
            return json_res({}, 200)
        except Exception:
            return json_res({'error': 'Bad request'}, 400) 
    elif request.method == 'DELETE':
        doctor = User.query.filter_by(id=doctor_id).first()
        if doctor:
            db.session.delete(doctor)
            db.session.commit()
            return json_res({}, 204)
        else:
            return json_res({'error': 'Not found'}, 404)
    else:
        doctor = User.query.filter_by(id=doctor_id, roleID=Role.get_id_by_role('Doctor')).all()
        if doctor:
            return json_res(query2jsonable(doctor), 200) 
        else:
            return json_res({'error': 'Not found'}, 404)