import json
from api.api_utils import json_res
from flask import  Blueprint

main = Blueprint('main', __name__)

@main.route('/')
@main.route('/home', methods=['GET'])
def index():
    return json_res({'index': 'hello world'}, 200)


@main.after_request
def add_cors(res):
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'POST, PUT, GET, OPTIONS, DELETE, PATCH'
    return res


@main.errorhandler(404)
def handle_not_found(_):
    return json_res({'error': 'Not found'}, 404)


@main.errorhandler(Exception)
def handle_exception(exc):
    return json_res({'error': 'Server error'}, 500)
