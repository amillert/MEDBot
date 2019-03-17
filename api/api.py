from flask import Flask, Response
import json

from api_utils import json_res
from blueprints.doctors import doctors_api
from blueprints.patients import patients_api
from blueprints.meds import meds_api

app = Flask(__name__)
app.register_blueprint(doctors_api, url_prefix='/doctors')
app.register_blueprint(patients_api, url_prefix='/patients')
app.register_blueprint(meds_api, url_prefix='/meds')


@app.route('/', methods=['GET'])
def index():
    return json_res({'index': 'hello world'}, 200)


@app.after_request
def add_cors(res):
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'POST, PUT, GET, OPTIONS, DELETE, PATCH'
    return res


@app.errorhandler(404)
def handle_not_found(_):
    return json_res({'error': 'Not found'}, 404)


@app.errorhandler(Exception)
def handle_exception(exc):
    return json_res({'error': 'Server error'}, 500)
