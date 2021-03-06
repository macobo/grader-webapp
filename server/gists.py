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
    return {"results" : list(gists.find({"post.public": True}))}

@app.route('/api/gists/<name>', methods=['GET'])
@dump_json
def get_gist(name):
    app.logger.info(name)
    post = db.db.gists.find_one({ "name": name }, sort=[("version", -1)])
    if post is None:
        abort(404)
    return post

@app.route('/api/gists', methods=['POST'])
@dump_json
def post_gist():
    post_data, name = request.json['post'], request.json.get('name', None)
    app.logger.debug(request.json)
    data = {"name": name, "post": post_data, "versions": [post_data], "version": 1}
    if not name:
        data['name'] = free_name(db.db.gists)
    else:
        post = db.db.gists.find_one({"name": name}, sort=[("version", -1)])
        if post:
            data = post
            data['version'] += 1
            data['post'] = post_data
            data['versions'].append(post_data)
    db.db.gists.save(data)
    return data

@app.route('/api/gists/<name>/update_name', methods=['POST'])
@dump_json
def update_gist(name):
    post = db.db.gists.find_one({"name": name})
    post['name'] = request.json['new_name']
    db.db.gists.save(post)
    return post