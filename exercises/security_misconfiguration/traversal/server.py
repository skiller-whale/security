from flask import Flask, send_file, request

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello'

@app.route('/getfile')
def get_file():
    try:
        response = send_file(request.args['file'])
    except Exception as e:
        response = str(e)
    
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2001)
