from flask import Flask, Response
import json

from api_utils import json_res
from blueprints.doctors import doctors_api

app = Flask(__name__)
app.register_blueprint(doctors_api, url_prefix='/doctors')

@app.route('/', methods=['GET'])
def index():
    return json_res({'index': 'hello world'}, 200)

@app.errorhandler(404)
def handle_not_found(_):
    return json_res({'error': 'Not found'}, 404)

@app.errorhandler(Exception)
def handle_exception(exc):
    return json_res({'error': 'Server error'}, 500)
