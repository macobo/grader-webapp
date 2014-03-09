from server import app, db
from flask import Blueprint, request, jsonify, abort
from .utils import dump_json

mod = Blueprint('gists', __name__)

import string
import random
def id_generator(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def free_name(collection = None):
    while True:
        _id = id_generator()
        if not collection.find_one({ "name": _id }):
            return _id

@mod.route('/api/gists', methods=['GET'])
@dump_json
def list_gists():
    gists = db.db.gists
    return {"results" : list(gists.find())}

@app.route('/api/gists/<name>', methods=['GET'])
@dump_json
def get_gist(name):
    post = db.db.gists.find_one({ "name": name }, sort=[("version", -1)])
    return post

@app.route('/api/gists', methods=['POST'])
@dump_json
def post_gist():
    post_data, name = request.json['post'], request.json.get('name', None)
    data = {"name": name, "post": post_data, "version": 1}
    if not name:
        data['name'] = free_name(db.db.gists)
    else:
        post = db.db.gists.find_one({"name": name}, sort=[("version", -1)])
        if post:
            data['version'] = post['version'] + 1
    db.db.gists.insert(data)
    return data