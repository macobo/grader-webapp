from os.path import *
import os
import json
import codecs

ROOT_DIR = abspath(dirname(__file__))
SERVER_DIR = join(ROOT_DIR, 'server')

secret_key_path = join(SERVER_DIR, "secret_key")
if not exists(secret_key_path):
    with open(secret_key_path, "wb") as f:
        f.write(os.urandom(24))

with open(secret_key_path) as f:
    SECRET_KEY = f.read()