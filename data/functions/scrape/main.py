# -*- coding: utf-8 -*-
import json
import codecs
from decimal import Decimal

import scrape_amedas
import amedas_point

import boto3
s3_client = boto3.client('s3')

import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def main():
    logger.info('start scraping')
    data, time = scrape_amedas.scrape()
    point = amedas_point.loadcsv('ame_master.csv')

    if data is None:
        return

    if check_time() == time:
        logger.info('already updated')
        return

    wind = wind_json(data, point)

    temp = elem_json('temp', data, point)
    rain = elem_json('rain', data, point)
    snow = elem_json('snow', data, point)
    sunlight = elem_json('sunlight', data, point)

    logger.info(time)
    print "wind: %d" % len(wind)
    print "temp: %d" % len(temp)
    print "rain: %d" % len(rain)
    print "snow: %d" % len(snow)
    print "sunlight: %d" % len(sunlight)

    files = []
    files.append(to_json("wind", time, wind))
    files.append(to_json("temp", time, temp))
    files.append(to_json("rain", time, rain))
    upload_s3(files)
    
    to_dynamodb(data, time)

    update_amedas_json(time)



def check_time():
    file = '/tmp/amedas-current.json'
    s3_client.download_file('amedas', 'amedas.json', file)

    with open(file, 'r') as f:
        data = json.load(f)
        return data['time']


def update_amedas_json(time):
    key = 'amedas.json'
    file = '/tmp/' + key

    data = {
        'time': time,
        'available': ['wind', 'temp', 'rain']
    }

    with open(file, 'w') as f:
        json.dump(data, f)

    logger.info('update amedas.json')
    s3_client.upload_file(file, 'amedas', key, ExtraArgs={ 'ContentType': 'application/json' })



def to_json(elem, time, data):
    file = '/tmp/' + elem + '-' + time + '.json'

    jsondata = {
        'time': time,
        'data': data
    }

    with codecs.open(file, 'w', 'utf-8') as f:
        json.dump(jsondata, f, ensure_ascii=False)

    return file


def wind_json(data, point):
    wind = {}

    for id in data.keys():
        if data[id]['wind_speed'] is not None:
            wind[id] = point[id].copy()
            wind[id]['speed'] = data[id]['wind_speed']
            wind[id]['dir'] = data[id]['wind_dir']

    return wind


def elem_json(elem, data, point):
    elems = {}

    for id in data.keys():
        if data[id][elem] is not None:
            elems[id] = point[id].copy()
            elems[id][elem] = data[id][elem]

    return elems


def upload_s3(files):
    for file in files:
        key = file[5:].replace('-', '/')
        logger.info('upload: ' + key)
        s3_client.upload_file(file, 'amedas', key, ExtraArgs={ 'ContentType': 'application/json' })


def to_dynamodb(data, time):
    logger.info('save to DynamoDB')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('amedas')

    with table.batch_writer() as batch:
        for id in data.keys():
            item = {
                'id':         id,
                'time':       time,
                'temp':       nDecimal(data[id]['temp']),
                'rain':       nDecimal(data[id]['rain']),
                'wind_speed': nDecimal(data[id]['wind_speed']),
                'wind_dir':   data[id]['wind_dir'],
                'sunlight':   data[id]['sunlight'],
                'snow':       data[id]['snow'],
            }
            batch.put_item(Item=item)


def nDecimal(x):
    if x is None:
        return None
    else:
        return Decimal(str(x))


# called by aws lambda
def handler(event, context):
    main()


if __name__ == '__main__':
    main()


