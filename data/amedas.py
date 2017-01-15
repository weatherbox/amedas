# -*- coding: utf-8 -*-
import requests
import re
import string

url = "http://www.tenki.jp/amedas/1/3/"

html = requests.get(url).text

iter = re.compile(r"amedas_link_html_entries\[(\d+)\] = '(.*?)';").finditer(html)

for match in iter:
    point_id = match.group(1)
    point_table = match.group(2)

    name_match = re.search(r'<th class="point_name" colspan="2">(.*?)\(.*?\)</th>', point_table)
    point_name = name_match.group(1)

    point_data = {}
    
    temp_match = re.search(u'<tr><th>気温</th><td>(.*?)℃</td></tr>', point_table)
    point_data['temp'] = float(temp_match.group(1)) if temp_match else None

    rain_match = re.search(u'<tr><th>降水量</th><td>(.*?)mm/h</td></tr>', point_table)
    point_data['rain'] = float(rain_match.group(1)) if rain_match else None

    wind_dir_match = re.search(u'<tr><th>風向</th><td>(.*?)</td></tr>', point_table)
    if wind_dir_match:
        wind_dir_jp = wind_dir_match.group(1)
        if wind_dir_jp == u'静穏':
            point_data['wind_dir'] = 'calm'
        else:
            point_data['wind_dir'] = wind_dir_jp.translate({
                ord(u'東'): u'E',
                ord(u'西'): u'W',
                ord(u'南'): u'S',
                ord(u'北'): u'N',
            })
    else:
        point_data['wind_dir'] = None

    wind_speed_match = re.search(u'<tr><th>風速</th><td>(.*?)m/s</td></tr>', point_table)
    point_data['wind_speed'] = float(wind_speed_match.group(1)) if wind_speed_match else None

    sunlight_match = re.search(u'<tr><th>日照時間</th><td>(.*?)分</td></tr>', point_table)
    point_data['sunlight'] = int(sunlight_match.group(1)) if sunlight_match else None
    
    snow_match = re.search(u'<tr><th>積雪深</th><td>(.*?)cm</td></tr>', point_table)
    point_data['snow'] = int(snow_match.group(1)) if snow_match else None

    print point_id, point_name, point_data


