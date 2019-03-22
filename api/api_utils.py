import json
from flask import Response

def json_res(obj: dict or list, code: int):
    return Response(json.dumps(obj), code, mimetype='application/json')

def query2jsonable(q_res):
    result_dict = [res.__dict__ for res in q_res]
    for res in result_dict:
        res.pop('_sa_instance_state', None) 
    if len(result_dict) == 1:
        return result_dict[0]
    else: 
       return result_dict
