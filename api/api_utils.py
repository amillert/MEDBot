import json
from flask import Response
from datetime import datetime

def json_res(obj: dict or list, code: int):
    return Response(json.dumps(obj), code, mimetype='application/json')

def query2jsonable(q_res):
    result_dict = [res.__dict__ for res in q_res]
    for res in result_dict:
        res.pop('_sa_instance_state', None)
        for r in res:
            if type(res[r]) is datetime:
                res[r] = res[r].isoformat(' ', 'seconds')

    if len(result_dict) == 1:
        return result_dict[0]
    else: 
        return result_dict
