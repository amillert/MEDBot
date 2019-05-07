import json
from flask import Blueprint, request, jsonify
from api import db, ma
from api.dao.models import Logs, LogSchema
logs_api = Blueprint('logs', __name__)


@logs_api.route('', methods=['GET', 'POST', 'DELETE'])
def logs():
    if request.method == 'GET':
       return jsonify(Logs.get_all()), 200
    elif request.method == 'POST':
        Logs.insert_into(request.get_json(force=True))
        return jsonify({}), 200
    elif request.method == 'DELETE':
        if(Logs.clear_logs() > 0):
            return jsonify({}), 200
        else:
            return jsonify({'error': 'Could not clear logs'}), 400

@logs_api.route('/raport', methods=['GET'])
def raport():
    return jsonify(Logs.get_admin_raport()), 200