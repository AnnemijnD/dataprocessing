# Annemijn Dijkhuis
# 11149272
# imports data and converts it to a JSONfiles

import csv
import json


def convert_csv_json():
    """
    Converts a csvfile to a jsonfile
    """

    # load files
    in_file = open('pers_exp.csv', 'r')
    out_file = open('pers_exp.json', 'w')

    # write rows
    reader = csv.DictReader(in_file, delimiter=';')
    rows = [row for row in reader]
    del rows[0]

    # write jsonfile
    output = json.dumps(rows)
    out_file.write(output)
    return out_file

if __name__ == "__main__":


    json_file = convert_csv_json()
