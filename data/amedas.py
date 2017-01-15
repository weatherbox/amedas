import requests
import re

url = "http://www.tenki.jp/amedas/1/3/"

html = requests.get(url).text

iter = re.compile(r"amedas_link_html_entries\[(\d+)\] = '(.*?)';").finditer(html)

for match in iter:
    point_id = match.group(1)
    point_table = match.group(2)

    name_match = re.search(r'<th class="point_name" colspan="2">(.*?)\(.*?\)</th>', point_table)
    point_name = name_match.group(1)

    point_data = []
    data_match = re.finditer(r'<td>(.*?)</td>', point_table)
    for d in data_match:
        point_data.append(d.group(1))

    print point_id, point_name, point_data


