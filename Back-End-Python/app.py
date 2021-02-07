import requests
import json
import pprint as pp
from flask import Flask, request
from flask_cors import CORS

file = open('key.txt', 'r')
key = file.read().strip()

app = Flask(__name__)
CORS(app)

cors = CORS(app,resources={
    r"/":{
        "origin": "*"
    }
})

@app.route('/distance', methods=['GET','POST'])
def my_index():
    data = request.get_json()
    origin = data['from']
    destination = data['to']

    url = ('https://maps.distancematrixapi.com/maps/api/distancematrix/json?units=metric'
        + '&origins={}'
        + '&destinations={}'
        + '&mode=car'
        + '&key={}'
        ).format(origin,destination,key)
    print(url)
    response = requests.get(url).json()
    for obj in response['rows']:
        for data in obj['elements']:
            print(data['distance']['value'])
            print(data['duration']['text'])
            return{
                'distance': data['distance']['value'],
                'duration': data['duration']['text']
            }
if __name__ == '__main__':
    app.run(debug=True)