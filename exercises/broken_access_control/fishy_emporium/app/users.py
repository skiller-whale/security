from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort
from .data import USERS

from app.auth import login_required

bp = Blueprint('users', __name__)

def validate_user_data(user_data):
    # simple validation - this is also vulnerable to injection!
    if len(user_data['username']) < 2:
        raise ValueError

    if len(user_data['name']) < 2:
        raise ValueError

    if len(user_data['address']) < 2:
        raise ValueError


@bp.route('/users/', methods=('GET',))
def users():
    return render_template('users.html', all_users=USERS.values())


@bp.route('/users/<int:user_id>', methods=('GET', 'POST'))
@login_required
def user(user_id=None):
    if user_id is None:
        user_id = g.user['id']
        return redirect(url_for('users.users', user_id=user_id))

    # return the user
    user = None
    try:
        user = USERS[user_id]
        # you can only edit your own profile
        user['can_edit'] = (g.user['id'] == user['id']) or (g.user['is_admin'])
    except KeyError:
        flash('No such user', 'error')


    if request.method == 'POST':
        if user is not None and (user['id'] == g.user['id'] or g.user['is_admin']):
            try:
                user_data = {
                    'username': request.form['username'],
                    'name': request.form['name'],
                    'address': request.form['address'],
                    'age': int(request.form['age']),
                    # 'roles': set(request.form.getlist('roles')),
                    'is_admin': request.form.get('is_admin') == 'on',
                    'is_public': request.form.get('is_public') == 'on'
                }

                try:
                    validate_user_data(user_data)
                except ValueError:
                    flash('Bad data', 'error')
                else:
                    for key, val in user_data.items():
                        USERS[user['id']][key] = val

                    user = USERS[user['id']]

                    if user['id'] == g.user['id']:
                        g.user = USERS[g.user['id']]


                    flash(f"Updated details for {user['username']}!", 'success')

            except Exception:
                flash('Malformed update request', 'error')


    return render_template('user.html', user=user)
