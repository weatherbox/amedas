# -*- coding: utf-8 -*-
import csv
import json
import re
import codecs

def loadcsv(file):
    # 重複あり
    # 官259( 気象台61(管区11) 航空79 特別95 )
    # 四 699
    # 三 103
    # 雨 401
    amedas = {}

    with open(file, 'r') as f:
        reader = csv.reader(f)
        header = next(reader)

        for row in reader:
            id = row[1]
            type = row[2]
            name = row[3]

            if re.search('航空', row[5]):
                type = 'airport'
            
            elif type == '官':
                type = 'observatory'

            elif type == '四' or type == '三':
                type = 'station'

            else:
                type = 'rain'

            lat = round((float(row[6]) + float(row[7]) / 60.) * 100000.) / 100000.
            lon = round((float(row[8]) + float(row[9]) / 60.) * 100000.) / 100000.

            #print id, type, name, lat, lon
            amedas[id] = {
                'name': name.decode('utf-8'),
                'type': type,
                'lat': lat,
                'lon': lon
            }

    return amedas

if __name__ == '__main__':
    import sys
    points = loadcsv(sys.argv[1])

    with codecs.open('amedas-point.json', 'w', 'utf-8') as f:
        json.dump(points, f, ensure_ascii=False)

