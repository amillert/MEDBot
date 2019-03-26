from flask import Blueprint, request
from flask import jsonify
from api import db
from api.api_utils import json_res, query2jsonable
from api.dao.models import Question, QuestionSchema

questions_api = Blueprint('questions', __name__)


@questions_api.route('', methods=['GET', 'POST'])
def questions():
     if request.method == 'POST':
        Question.insert_into(request.get_json(force=True))
        return jsonify({}), 201
     else:
        return jsonify({'questions': Question.get_all_questions()}), 200
