from flask import Flask, send_from_directory, redirect, send_file
from pathlib import Path
import jinja2
import json
import os

TEMPLATE_FILE = 'index.html'
app = Flask(__name__)

templateLoader = jinja2.FileSystemLoader(searchpath='/app/static')
templateEnv = jinja2.Environment(loader=templateLoader)

def generate_template(language):
    print(f'Generating template for {language}')
    template = templateEnv.get_template(TEMPLATE_FILE)

    with open('/app/static/localization.json') as localization_file:
        localization_vars = json.loads(localization_file.read())

    template_vars = localization_vars[language]

    # loop and save templates
    output_text = template.render(template_vars)

    with open(f'/app/static/cached/index.{language}.html', 'w') as output_file:
        output_file.write(output_text)


@app.route('/')
def root():
    return redirect('/index/en', code=301)

@app.route('/index/<language>')
def index(language):
    path = Path('/app/static/cached') / f'index.{language}.html'
    if not os.path.exists(path):
        generate_template(language)

    return send_from_directory(
        '/app/static/cached',
        f'index.{language}.html'
    )

@app.route('/static/<file>')
def static_route(file):
    return send_from_directory('/app/static', file)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8001)
