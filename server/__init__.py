import os.path
import sys
import config

from flask import Flask, request
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