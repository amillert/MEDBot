import json
from flask import Response

def json_res(obj: dict, code: int):
    return Response(json.dumps(obj), code, mimetype='application/json')
