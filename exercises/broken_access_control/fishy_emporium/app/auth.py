import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from .data import USERS


def _check_password_hash(true_password, password):
    if true_password is None:
        return False
    return check_password_hash(true_password, password)


def _check_login_details(username, password):
    """Helper method to check login details."""
    if any(
        (match := user)['username'] == username and _check_password_hash(user['password_hash'], password)
        for user_id, user in USERS.items()
    ):
        return match

    raise ValueError


def has_permissions(user_id, action, object):
    if 'type' not in object or object['type'] != 'user':
        # the only resource is users
        return False

    if action in ['view', 'edit']:
        return user_id == object['id'] or 'admin' in USERS[user_id]

    return False


# Initialize Blueprint object.
bp = Blueprint('auth', __name__, url_prefix='/auth')

# Routes below
@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        try:
            g.user = USERS[user_id]
        except KeyError:
            g.user = None


@bp.route('/login', methods=('GET', 'POST'))
def login():
    if g.user is not None:
        return redirect(url_for('users.users', user_id=g.user['id']))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        error = None

        if username is None:
            error = 'No username.'
        if password is None:
            error = 'No password.'

        try:
            user = _check_login_details(username, password)
        except ValueError:
            error = 'Incorrect username/password'

        if error is None:
            session.clear()
            session['user_id'] = user['id']

            flash('Logged in', 'success')
            return redirect(url_for('users.users', user_id=user['id']))

        flash(error, 'error')

    return render_template('login.html')


@bp.route('/logout', methods=('POST', ))
def logout():
    session.clear()
    flash('Logged out', 'info')
    return redirect(url_for('auth.login'))


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view


def has_role(view, role):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None or role not in g.user['roles']:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view
