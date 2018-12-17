# Annemijn Dijkhuis
# 11149272
# imports KNMI data and creates a JSON file

import csv
import json


def convert_csv_json(infile, outfile):
    """
    Converts a csvfile to a jsonfile
    """

    # load files
    in_file = open(infile, 'r')
    out_file = open(outfile, 'w')

    # make list of rows for json format of choice
    new_rows = []

    # extract current rows
    reader = csv.DictReader(in_file)
    rows = [row for row in reader]

    # componse new format of rows
    current_country = ""
    for i in range(len(rows)):

        # check if country was already added to new_rows
        if not rows[i]["Country"] == current_country:
            current_country = rows[i]["Country"]
            new_rows.append({current_country:{}})

        # add values of the fields to the countries
        field = [rows[i]["NACE"]][0]
        value = int(float(rows[i]["Value in JRC - Bioeconomics"]))
        new_rows[-1][current_country].update({field: value})

    # write jsonfile
    output = json.dumps(new_rows)
    out_file.write(output)
    return out_file

if __name__ == "__main__":
    infile = "data_eu.csv"
    outfile = "data_eu.json"
    json_file = convert_csv_json(infile, outfile)
