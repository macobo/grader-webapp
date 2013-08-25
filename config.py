from os.path import *
import json
import codecs

ROOT_DIR = abspath(dirname(__file__))
SERVER_DIR = join(ROOT_DIR, 'server')

TESTERS_DIR = join(dirname(ROOT_DIR), "python-grader", "tasks")

def get_tasks():
    with codecs.open(join(TESTERS_DIR, "tasks.json"), "r", "utf-8") as f:
        return json.load(f)

def get_tester_module(task):
    tasks = get_tasks()
    module = graders[task["unit"]][task["name"].lower()]["tester"]
    return module