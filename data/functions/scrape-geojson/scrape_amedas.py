import requests
import json
import re

def scrape():
    url = 'https://tenki.jp/amedas/map/'
    return scrape_amedas_html(url)

def scrape_amedas_html(url):
    html = requests.get(url).text

    time = get_time(html)
    
    features = []

    iter = re.compile(r"L.marker\(\[(.*?), (.*?)\], \{icon:icon_amedas_.*?\}\).addTo\(map\).bindPopup\('(.*?)'\);").finditer(html)

    for match in iter:
        lat = float(match.group(1))
        lon = float(match.group(2))
        point_table = match.group(3)
        d = scrape_amedas_table(point_table)

        features.append({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [lon, lat]
            },
            'properties': d
        })
    
    geojson = {
        'type': 'FeatureCollection',
        'features': features
    }

    return time, geojson

def get_time(html):
    r = re.search(r'<time datetime="(.*?)" class="date-time">\d+日(\d+):(\d+)現在</time>', html)
    time_str1 = r.group(1)
    hour      = r.group(2)
    minute    = r.group(3)
    time = time_str1[0:4] + time_str1[5:7] + time_str1[8:10] + hour + minute
    return time

def scrape_amedas_table(point_table):
    return {
        'id':         get_id(point_table),
        'name':       get_name(point_table),
        'temp':       get_temp(point_table),
        'rain':       get_rain(point_table),
        'sunlight':   get_sunlight(point_table),
        'snow':       get_snow(point_table),
        'wind_speed': get_wind_speed(point_table),
        'wind_dir':   get_wind_dir(point_table),
    }

def get_id(point_table):
    id_match = re.search(r'<a href="/amedas/\d+/\d+/(\d+).html">', point_table)
    return id_match.group(1)

def get_name(point_table):
    name_match = re.search(r'<th colspan="2" class="name">(.*?)</th>', point_table)
    return name_match.group(1)
    
def get_temp(point_table):
    temp_match = re.search('<tr><th>気温</th><td>(.*?)℃</td></tr>', point_table)
    return float(temp_match.group(1)) if temp_match else None

def get_rain(point_table):
    rain_match = re.search('<tr><th>降水量</th><td>(.*?)mm/h</td></tr>', point_table)
    return float(rain_match.group(1)) if rain_match else None

def get_sunlight(point_table):
    sunlight_match = re.search('<tr><th>日照時間</th><td>(.*?)分</td></tr>', point_table)
    return int(sunlight_match.group(1)) if sunlight_match else None

def get_snow(point_table):
    snow_match = re.search('<tr><th>積雪深</th><td>(.*?)cm</td></tr>', point_table)
    return int(snow_match.group(1)) if snow_match else None

def get_wind_speed(point_table):
    wind_speed_match = re.search('<tr><th>風速</th><td>(.*?)m/s</td></tr>', point_table)
    return float(wind_speed_match.group(1)) if wind_speed_match else None

def get_wind_dir(point_table):
    wind_dir_match = re.search('<tr><th>風向</th><td>(.*?)</td></tr>', point_table)
    if wind_dir_match:
        wind_dir_jp = wind_dir_match.group(1)
        degrees = {
            '---': None,
            '静穏': 'calm',
            '北': 0,   '北北東': 22.5,  '北東': 45,  '東北東': 67.5,
            '東': 90,  '東南東': 112.5, '南東': 135, '南南東': 157.5,
            '南': 180, '南南西': 202.5, '南西': 225, '西南西': 247.5,
            '西': 270, '西北西': 292.5, '北西': 315, '北北西': 337.5
        }
        return degrees[wind_dir_jp]

    else:
        return None


if __name__ == '__main__':
    time, geojson = scrape()
    print(time)
    print(json.dumps(geojson, ensure_ascii=False))

