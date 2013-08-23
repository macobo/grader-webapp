from os.path import *
import json

ROOT_DIR = abspath(dirname(__file__))
SERVER_DIR = join(ROOT_DIR, 'server')

TESTERS_DIR = join(dirname(ROOT_DIR), "python-grader", "tasks")

def get_tester_module(task):
    graders = json.loads(open(join(TESTERS_DIR, "tasks.json")).read())
    module = graders[task["unit"]][task["name"].lower()]["tester"]
    return module