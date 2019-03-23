import json
from flask import Blueprint, request
from api import db
from api.api_utils import json_res, query2jsonable
from api.dao.models import User, Role, Interview

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


@doctors_api.route('/<doctor_id>/interviews', methods=['GET', 'POST'])
def doctor_route_interviews(doctor_id):
    if request.method == 'POST':
        req = request.get_json(force=True)
        doctor = User.query.filter_by(id=doctor_id, roleID=Role.get_id_by_role('Doctor')).first()
        print(doctor)
        interview = Interview(DoctorID=doctor_id, PatientID=req['PatientID'])
        print(interview)
        db.session.add(interview)
        db.session.commit()
        return json_res({}, 201)
    else:
        doctor = User.query.filter_by(id=doctor_id, roleID=Role.get_id_by_role('Doctor')).first()
        if doctor:
            interviews = doctor.sent_interviews
            return json_res(query2jsonable(interviews), 200) 
        else:
            return json_res({'error': 'Not found'}, 404)
      

@doctors_api.route('/<doctor_id>/interviews/<interview_id>', methods=['GET', 'PUT', 'DELETE'])
def doctor_route_interview(doctor_id, interview_id):
    if request.method == 'PUT':
        try: 
            interview = Interview.query.filter_by(id=interview_id).update(dict(request.get_json(force=True)))
            if interview == 0:
                return json_res({'error': 'Not found'}, 404)
            db.session.commit()
            return json_res({}, 200)
        except Exception:
            return json_res({'error': 'Bad request'}, 400) 
    elif request.method == 'DELETE':
        interview = Interview.query.filter_by(id=interview_id).first()
        if interview:
            db.session.delete(interview)
            db.session.commit()
            return json_res({}, 204)
        else:
            return json_res({'error': 'Not found'}, 404)
    else:
        interview = Interview.query.filter_by(id=interview_id, DoctorID=doctor_id)
        return json_res(query2jsonable(interview), 200)
