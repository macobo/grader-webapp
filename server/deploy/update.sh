#!/bin/sh

# updates application on the server
# executed when git hook fired

APP_FOLDER=/home/macobo/projects/grader-webapp/
GRADER_FOLDER=/home/macobo/projects/python-grader/

cd $GRADER_FOLDER
git pull
python setup.py install

cd $APP_FOLDER
git pull
cd client
# install new dependencies, build static files
bower install
npm install
grunt build

cd ..
kill -HUP `cat /home/macobo/jobs/.gunicorn.pid`