import os.path
import config
import json
import subprocess
import grader
from flask.ext.pymongo import PyMongo

from werkzeug.contrib.fixers import ProxyFix

from flask import Flask, request, jsonify, abort
app = Flask(__name__, static_folder='static', static_url_path='')
app.wsgi_app = ProxyFix(app.wsgi_app) # for gunicorn
db = PyMongo(app)

import logging
from logging.handlers import RotatingFileHandler
file_handler_path = os.path.join(config.ROOT_DIR, 'flask.log')
file_handler = RotatingFileHandler(file_handler_path, maxBytes=10**7)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(file_handler)

@app.route('/api/grade', methods=['POST'])
def test_solution2():
    data = request.json
    app.logger.info(data)
    answer = grader.test_solution(
        data['grader_code'],
        data['solution_code']   
    )
    app.logger.debug(answer)
    return jsonify(answer)


@app.route('/webhook', methods=['POST'])
def webhook():
    " github webhook "
    app.logger.info(request.form["payload"])
    subprocess.call(os.path.join(config.SERVER_DIR, "deploy", "update.sh"))
    return ""
