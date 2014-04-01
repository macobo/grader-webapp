import config
import os
import grader
from flask.ext.pymongo import PyMongo

from werkzeug.contrib.fixers import ProxyFix

from flask import Flask, request, jsonify

app = Flask(__name__, static_folder='static', static_url_path='')
app.wsgi_app = ProxyFix(app.wsgi_app)  # for gunicorn
app.config.from_object('config')
db = PyMongo(app)

from . import models
from .gists import mod
app.register_blueprint(mod)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/grade', methods=['POST'])
def test_solution2():
    data = request.json
    app.logger.info(data)
    answer = grader.test_solution(
        data['grader_code'],
        data['solution_code'],
        data.get('assets_files', []),
        'docker'
    )
    app.logger.debug(answer)
    return jsonify(answer)


@app.route('/webhook', methods=['POST'])
def webhook():
    " github webhook "
    from grader import code_runner
    if hasattr(request, "form") and "payload" in request.form:
        app.logger.info("Updating. {}".format(request.form["payload"]))
    else: 
        app.logger.info("Updating without post.")

    cmd = os.path.join(config.SERVER_DIR, "deploy", "update.sh")
    (status, stdout, stderr) = code_runner.call_command(cmd)
    app.logger.info("""\
        Update results:
        Status: {}
        Stdout:
        {}
        -----
        -----
        Stderr:
        {}""".format(status, stdout, stderr))
    return ""


import logging
from logging.handlers import RotatingFileHandler
file_handler_path = os.path.join(config.ROOT_DIR, 'flask.log')
file_handler = RotatingFileHandler(file_handler_path, maxBytes=8 * 10**7)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(file_handler)