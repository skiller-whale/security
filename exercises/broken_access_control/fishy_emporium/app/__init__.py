import os

from flask import Flask, redirect


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import auth
    app.register_blueprint(auth.bp)

    from . import users
    app.register_blueprint(users.bp)

    # app.add_url_rule('/', endpoint='auth.login')

    @app.route('/')
    def index():
        return redirect("/auth/login", code=302)

    return app