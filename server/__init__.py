import os.path
import config
import json
import subprocess
from grader.utils import tempModule

from werkzeug.contrib.fixers import ProxyFix

from flask import Flask, request, jsonify
app = Flask(__name__, static_folder='static', static_url_path='')
app.wsgi_app = ProxyFix(app.wsgi_app) # for gunicorn

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
    app.logger.debug(data)

    temp_dir = config.TESTERS_DIR # TODO!
    tester_module = config.get_tester_module(data['task'])
    with tempModule(data['code'], temp_dir) as solution_module:
        subproc = subprocess.Popen(
            ['python3', '-m', 'grader', tester_module, solution_module],
            cwd=temp_dir, stdin=subprocess.PIPE,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = subproc.communicate()
        app.logger.debug(stderr)
    answer = json.loads(stdout.decode("utf-8"))
    app.logger.debug(answer)
    return jsonify(answer)


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = config.get_tasks()
    # the app uses form [{name: task_name, unit: unit}...]
    rev_tasks = [{"unit": unit, "name": name.capitalize()} 
                for unit in tasks for name in tasks[unit]]
    rev_tasks.sort(key = lambda e: (int(e["unit"]), e["name"]))
    return jsonify({"tasks": rev_tasks})


@app.route('/webhook', methods=['POST'])
def webhook():
    " github webhook "
    app.logger.info(request.form["payload"])
    subprocess.call(os.path.join(config.SERVER_DIR, "deploy", "update.sh"))
    return ""
