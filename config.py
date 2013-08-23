from os.path import *
import json
import codecs

ROOT_DIR = abspath(dirname(__file__))
SERVER_DIR = join(ROOT_DIR, 'server')

TESTERS_DIR = join(dirname(ROOT_DIR), "python-grader", "tasks")

def get_tester_module(task):
    with codecs.open(join(TESTERS_DIR, "tasks.json"), "r", "utf-8") as f:
        graders = json.load(f)
    module = graders[task["unit"]][task["name"].lower()]["tester"]
    return module