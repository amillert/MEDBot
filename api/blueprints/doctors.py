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
        print(req['firstName'])
        doctor = User(email=req['email'], password=req['password'], firstName=req['firstName'], lastName=req['lastName'], roleID=2)
        db.session.add(doctor)
        db.session.commit()
        return json_res({}, 201)
    else:
        query_res = query2jsonable(User.query.filter_by(roleID=Role.get_id_by_role('Doctor')).all())
        return json_res(query_res, 200)


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
        doctor = query2jsonable(User.query.filter_by(id=doctor_id))
        if doctor:
            return json_res(doctor, 200) 
        else:
            return json_res({'error': 'Not found'}, 404)