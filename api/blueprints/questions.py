from flask import Blueprint, request
from flask import jsonify
from api import db
from api.api_utils import json_res, query2jsonable
from api.dao.models import Question, QuestionSchema
from sqlalchemy.exc import IntegrityError
questions_api = Blueprint('questions', __name__)


@questions_api.route('', methods=['GET', 'POST'])
def questions():
   try:
      if request.method == 'POST':
         Question.insert_into(request.get_json(force=True))
         return jsonify({}), 201
      else:
         return jsonify({'questions': Question.get_all_questions()}), 200
   except IntegrityError as e:
      db.session.rollback()
      return jsonify({'error': 'Question is alredy in the database'}), 400

@questions_api.route('/<question_id>', methods=['DELETE', 'PUT', 'GET'])
def question(question_id):
   if request.method == 'PUT':
         try: 
            updated = Question.update_question(request.get_json(force=True), question)
            if updated:
               return jsonify({}), 200
            return jsonify({'error': 'Not found'}), 404
         except Exception:
            return jsonify({'error': 'Bad request'}), 400
   elif request.method == 'DELETE':
         deleted = Question.delete_question(question_id)
         if deleted:
               return jsonify({}), 204
         return jsonify({'error': 'Not found'}), 404
   else:
      question = QuestionSchema().dump(Question.query.get(question_id)).data
      if question:
         return jsonify({'Question': question}), 200
      return jsonify({'error': 'Not found'}), 404
