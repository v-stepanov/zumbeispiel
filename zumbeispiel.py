#!/usr/bin/env python3

from flask import Flask, Response
import requests
import tokens
import json

tokens.manage('mytoken', ['uid'])
tokens.start()

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/metrics', methods=['GET'])
def expose_metrics():
    aToken = tokens.get('mytoken')

    response = requests.get('http://localhost:8081/metrics',
                 headers={'Authorization': 'Bearer {}'.format(aToken)})

    json_result = json.dumps(response.json(), indent=2)
    print(json_result)
    return Response(json_result,
                    status=200,
                    mimetype='application/json')

if __name__ == '__main__':
    app.run(threaded=True, port=8777)