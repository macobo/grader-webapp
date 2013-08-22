import os.path
import config

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
    app.logger.debug(data)
    return jsonify(data)