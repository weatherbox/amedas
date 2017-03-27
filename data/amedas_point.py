# -*- coding: utf-8 -*-
import csv
import json

def loadcsv(file):
    with open(file, 'r', 'utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        print header

        for row in reader:
            print row


if __name__ == '__main__':
    import sys
    loadcsv(sys.argv[1])

