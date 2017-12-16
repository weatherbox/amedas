import json, gzip

import scrape_amedas

import boto3
s3_client = boto3.client('s3')

def main():
    time, geojson = scrape_amedas.scrape()
    print(time)

    upload_geojson(geojson, time)
    update_amedas_json(time)

    
def upload_geojson(geojson, time):
    file = '/tmp/amedas-' + time + '.geojson.gz'
    key = time[:8] + '/amedas-' + time + '.geojson.gz'


    with gzip.open(file, 'w') as f:
        f.write(json.dumps(geojson, ensure_ascii=False).encode('utf-8'))

    print('upload: ' + key)
    s3_client.upload_file(file, 'amedas', key, ExtraArgs={
        'ContentType': 'application/json; charset=utf-8',
        'ACL': 'public-read',
        'ContentEncoding': 'gzip'})


def update_amedas_json(time):
    key = 'amedas.json'
    file = '/tmp/' + key

    data = {
        'time': time
    }

    with open(file, 'w') as f:
        json.dump(data, f)

    print('update amedas.json')
    s3_client.upload_file(file, 'amedas', key, ExtraArgs={
        'ContentType': 'application/json; charset=utf-8',
        'ACL': 'public-read' })



# called by aws lambda
def handler(event, context):
    main()


if __name__ == '__main__':
    main()


