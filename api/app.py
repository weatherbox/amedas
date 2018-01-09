from chalice import Chalice
from bs4 import BeautifulSoup
import requests
import re

app = Chalice(app_name='api')


@app.route('/hello/{name}')
def hello_name(name):
    return {'hello': 'world'}



def parse(id):
    r = requests.get('https://tenki.jp/amedas/9/46/86467.html')
    soup = BeautifulSoup(r.text, "html.parser")

    data = {}

    # altitude
    address = soup.find("td", class_="amedas-checked-map-link").text
    match = re.search(r"\(標高：(.+)\)", address)
    data['altitude'] = match.group(1)
    
    # datetime
    time = soup.find("time", id="amedas-point-datetime")
    data['datetime'] = time.get("datetime"))

    # table 10min, 1hour
    tables = soup.find_all("table", class_="amedas-table-entries")
    data['10min'] = parse_table(tables[0])
    data['1hour'] = parse_table(tables[1])

    print(data)

def parse_table(table):
    rows = []
    for row in table.find_all("tr"):
        tds = [td.text for td in row.find_all("td")]
        tds = [td if td != "---" else None for td in tds]
        if len(tds) > 0:
           rows.append(tds[-7:]) 

    return rows

if __name__ == '__main__':
    parse('')


