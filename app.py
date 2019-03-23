from api import create_app
from api.api_utils import json_res
app = create_app()


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


if __name__ == '__main__':
    app.run()
