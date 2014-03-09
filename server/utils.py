from flask import Response
from bson.json_util import dumps
from functools import wraps

def dump_json(func):
    @wraps(func)
    def _inner(*args, **kwargs):
        result = func(*args, **kwargs)
        response = Response(
            response=dumps(result), 
            status=200, 
            headers=None, 
            mimetype='application/json'
        )
        return response
    return _inner