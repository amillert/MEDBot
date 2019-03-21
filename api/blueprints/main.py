import json
from api.api_utils import json_res
from flask import  Blueprint

main = Blueprint('main', __name__)

@main.route('/')
@main.route('/home', methods=['GET'])
def index():
    return json_res({'index': 'hello world'}, 200)
