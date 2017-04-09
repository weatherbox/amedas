# -*- coding: utf-8 -*-
import requests
import re
import json


def scrape(check_time):
    data = {}

    url_base = "http://www.tenki.jp/amedas/"
    areas = [
        "1/1", "1/3", "1/4",
        "2/6", "2/7", "2/10",
        "3/11", "3/15", "3/16", "3/23",
        "4/18", "4/21",
        "5/25", "5/27",
        "6/31",
        "7/35", "7/37",
        "8/42",
        "9/45", "9/47", "9/49",
        "10/50"
    ]

    time = None
    for area in areas:
        time1 = scrape_amedas_html(url_base + area + "/precip.html", data)

        # check time
        if time1 == check_time:
            print "already updated"
            return None, check_time

        if time:
            if time1 != time:
                print "time differs"
                return None, time

        else:
            time = time1

    return data, time


def scrape_amedas_html(url, data):
    html = requests.get(url).text

    time = re.search(r'id="amedas_announce_datetime">(.*?)</div>', html)
    time_str = time.group(1)
    time = time_str[0:4] + time_str[5:7] + time_str[8:10] + time_str[12:14] + time_str[15:17]
    print "get...." + url + " (" + time + ")"

    iter = re.compile(r"amedas_link_html_entries\[(\d+)\] = '(.*?)';").finditer(html)

    for match in iter:
        point_id = str(match.group(1))
        point_table = match.group(2)
        data[point_id] = scrape_amedas_table(point_table)

    return time

def scrape_amedas_table(point_table):
    return {
        'name':       get_name(point_table),
        'temp':       get_temp(point_table),
        'rain':       get_rain(point_table),
        'sunlight':   get_sunlight(point_table),
        'snow':       get_snow(point_table),
        'wind_speed': get_wind_speed(point_table),
        'wind_dir':   get_wind_dir(point_table),
    }

def get_name(point_table):
    name_match = re.search(r'<th class="point_name" colspan="2">(.*?)\(.*?\)</th>', point_table)
    return name_match.group(1)
    
def get_temp(point_table):
    temp_match = re.search(u'<tr><th>気温</th><td>(.*?)℃</td></tr>', point_table)
    return float(temp_match.group(1)) if temp_match else None

def get_rain(point_table):
    rain_match = re.search(u'<tr><th>降水量</th><td>(.*?)mm/h</td></tr>', point_table)
    return float(rain_match.group(1)) if rain_match else None

def get_sunlight(point_table):
    sunlight_match = re.search(u'<tr><th>日照時間</th><td>(.*?)分</td></tr>', point_table)
    return int(sunlight_match.group(1)) if sunlight_match else None

def get_snow(point_table):
    snow_match = re.search(u'<tr><th>積雪深</th><td>(.*?)cm</td></tr>', point_table)
    return int(snow_match.group(1)) if snow_match else None

def get_wind_speed(point_table):
    wind_speed_match = re.search(u'<tr><th>風速</th><td>(.*?)m/s</td></tr>', point_table)
    return float(wind_speed_match.group(1)) if wind_speed_match else None

def get_wind_dir(point_table):
    wind_dir_match = re.search(u'<tr><th>風向</th><td>(.*?)</td></tr>', point_table)
    if wind_dir_match:
        wind_dir_jp = wind_dir_match.group(1)
        if wind_dir_jp == u'<span class="grey">---</span>':
            return None

        elif wind_dir_jp == u'静穏':
            return 'calm'

        else:
            return wind_dir_jp.translate({
                ord(u'東'): u'E',
                ord(u'西'): u'W',
                ord(u'南'): u'S',
                ord(u'北'): u'N',
            })
    else:
        return None

if __name__ == '__main__':
    data, time = scrape()

    print time
    print str(len(data)) + " points"
    print json.dumps(data, ensure_ascii=False)

