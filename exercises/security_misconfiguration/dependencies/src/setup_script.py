import jinja2
import json

TEMPLATE_FILE = 'index.html'

if __name__ == '__main__':
    templateLoader = jinja2.FileSystemLoader(searchpath='static')
    templateEnv = jinja2.Environment(loader=templateLoader)

    template = templateEnv.get_template(TEMPLATE_FILE)

    with open('static/localization.json') as localization_file:
        localization_vars = json.loads(localization_file.read())

    # loop and save templates
    for language, template_vars in localization_vars.items():
        output_text = template.render(template_vars)

        with open(f'static/index.{language}.html', 'w') as output_file:
            output_file.write(output_text)
