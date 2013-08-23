from os.path import *

ROOT_DIR = abspath(dirname(__file__))
SERVER_DIR = join(ROOT_DIR, 'server')

TESTERS_DIR = join(dirname(ROOT_DIR), "python-grader", "tasks")

TASK_GRADERS = {
    2: {
        "küpsisetort": "u2_kypsisetort_tester.py",
        "nimed":       "u2_nimed_tester.py",
        "intress":     "u2_intress_tester.py",
    },
    6: {

    },
    12: {

    }
}

def get_tester_module(task):
    module = TASK_GRADERS[task["unit"]][task["name"].lower()]
    return module