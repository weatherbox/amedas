import os
import csv
import codecs


def main(dir, csvfile):
    files = os.listdir(dir)

    points = []
    for file in files[:1]:
        dates, data = parsecsv(dir, file)
        points.extend(data)

    with open(csvfile, 'w') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerows(points)


def parsecsv(dir, file):
    with codecs.open(dir + '/' + file, 'r', 'shift-jis') as f:
        reader = csv.reader(f, delimiter=',')
        next(reader)
        next(reader)

        rows = [row for row in reader]
        columns = list(map(list, zip(*rows))) # transpose

        dates = columns[0]
        del dates[1:3]

        points = []
        for column in columns:
            if column[1] == '降水量(mm)' and column[2] == '' and column[3] != '':
                del column[1:3]
                points.append(column)

        return dates, points



if __name__ == '__main__':
    main('data/201807', 'data/pre_h20180628-20180708.csv')

