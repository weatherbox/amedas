# -*- coding: utf-8 -*-
import json
import copy
import codecs

import scrape_amedas
import amedas_point

import boto3
s3_client = boto3.client('s3')


def main():
    data, time = scrape_amedas.scrape()
    point = amedas_point.loadcsv('ame_master.csv')

    wind = wind_json(data, point)

    temp = elem_json('temp', data, point)
    rain = elem_json('rain', data, point)
    snow = elem_json('snow', data, point)
    sunlight = elem_json('sunlight', data, point)

    print time
    print "wind: %d" % len(wind)
    print "temp: %d" % len(temp)
    print "rain: %d" % len(rain)
    print "snow: %d" % len(snow)
    print "sunlight: %d" % len(sunlight)
    #print json.dumps(sunlight, ensure_ascii=False)

    files = []
    files.append(out_json("wind", time, wind))
    files.append(out_json("temp", time, wind))
    files.append(out_json("rain", time, wind))

    upload_s3(files)


def out_json(elem, time, data):
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
            wind[id] = copy.deepcopy(point[id])
            wind[id]['speed'] = data[id]['wind_speed']
            wind[id]['dir'] = data[id]['wind_dir']

    return wind


def elem_json(elem, data, point):
    elems = {}

    for id in data.keys():
        if data[id][elem] is not None:
            elems[id] = copy.deepcopy(point[id])
            elems[id][elem] = data[id][elem]

    return elems


def upload_s3(files):
    for file in files:
        key = file[5:].replace('-', '/')
        print key
        s3_client.upload_file(file, 'amedas', key, ExtraArgs={ 'ContentType': 'application/json' })


if __name__ == '__main__':
    main()


