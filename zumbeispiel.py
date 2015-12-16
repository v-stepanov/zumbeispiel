#!/usr/bin/env python3

from flask import Flask, Response
import requests
import tokens
import json
from cachetools import ttl_cache

tokens.manage('mytoken', ['uid'])
tokens.start()

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/metrics', methods=['GET'])
def expose_metrics():
    try:
        metrics = get_metrics()
    except:
        return Response({}, status=503)

    json_result = json.dumps(metrics, indent=2)
    return Response(json_result,
                    status=200,
                    mimetype='application/json')

@ttl_cache(1000, 5)
def get_metrics():
    print('grab metrics')
    a_token = tokens.get('mytoken')
    response = requests.get('http://localhost:8081/metrics',
                            headers={'Authorization': 'Bearer {}'.format(a_token)})
    if response.status_code != requests.codes.ok:
        raise Exception('Got error response from metrics endpoint')
    return response.json()

if __name__ == '__main__':
    app.run(threaded=True, port=8777)