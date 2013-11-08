from os.path import *
import json
import codecs

ROOT_DIR = abspath(dirname(__file__))
SERVER_DIR = join(ROOT_DIR, 'server')

TASKS_DIR = join(dirname(ROOT_DIR), "grader-tasks")

def get_tasks():
    with codecs.open(join(TASKS_DIR, "tasks.json"), "r", "utf-8") as f:
        return json.load(f)

def get_tester_module(task):
    tasks = get_tasks()
    module = tasks[task["unit"]][task["name"].lower()]["tester"]
    return module

def get_tester_dir(task):
    tasks = get_tasks()
    unit = tasks[task["unit"]]
    path = TASKS_DIR
    if "path" in unit:
        path = join(path, unit["dir"])
    return path