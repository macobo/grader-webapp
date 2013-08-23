import os.path
import config
import grader
import json
import subprocess
from grader.utils import tempModule

from flask import Flask, request, jsonify
app = Flask(__name__, static_folder='static', static_url_path='')

if not app.debug:
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

@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/api/grade_solution', methods=['POST'])
def test_solution():
    data = request.json

    temp_dir = config.TESTERS_DIR # TODO!
    tester_module = config.get_tester_module(data['task'])
    with tempModule(data['code'], temp_dir) as solution_module:
        subproc = subprocess.Popen(
            ['python3', '-m', 'grader', tester_module, solution_module],
            cwd=temp_dir, stdin=subprocess.PIPE,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = subproc.communicate()
        app.logger.debug(stderr)
    app.logger.debug(stdout.decode("utf-8"))
    answer = json.loads(stdout.decode("utf-8"))
    app.logger.debug(answer)
    return jsonify(answer)