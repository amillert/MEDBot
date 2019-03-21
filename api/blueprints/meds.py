from flask import Blueprint, request
from api.api_utils import json_res
from api.dao import fakedb as db
from api.config import MEDS_TABLE

meds_api = Blueprint('meds', __name__)

@meds_api.route('', methods=['GET', 'POST'])
def meds_route():
    if request.method == 'POST':
        med = request.get_json(force=True)
        db.create(MEDS_TABLE, med)
        return json_res({}, 201)
    else:
        return json_res(db.get_all(MEDS_TABLE), 200)


@meds_api.route('/<med_id>', methods=['GET', 'PUT', 'DELETE'])
def med_route(med_id):
    if request.method == 'PUT':
        med = request.get_json(force=True)
        if med.get('id', '') != med_id:
            return json_res({'error': 'Bad request'}, 400)
        res = db.update(MEDS_TABLE, med)
        return json_res({}, 200) if res else json_res({'error': 'Not found'}, 404)
    elif request.method == 'DELETE':
        res = db.delete(MEDS_TABLE, med_id)
        return json_res({}, 204) if res else json_res({'error': 'Not found'}, 404)
    else:
        med = db.get(MEDS_TABLE, med_id)
        return json_res(med, 200) if med is not None else json_res({'error': 'Not found'}, 404)