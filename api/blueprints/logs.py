import json
from flask import Blueprint, request, jsonify
from api import db, ma
from api.dao.models import Logs, LogSchema
logs_api = Blueprint('logs', __name__)


@logs_api.route('', methods=['GET', 'POST'])
def logs():
    if request.method == 'GET':
       return jsonify(Logs.get_all()), 200
    else:
        Logs.insert_into(request.get_json(force=True))
        return jsonify({}), 200