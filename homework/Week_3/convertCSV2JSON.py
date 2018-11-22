# Annemijn Dijkhuis
# 11149272
# imports KNMI data and creates a JSON file

import csv
import json





def convert_txt_csv(wind_txt, wind_csv):

    in_file = csv.reader(open(wind_txt, "r"), delimiter = ',')
    out_file = csv.writer(open(wind_csv, "w"), delimiter = ",")

    out_file.writerow(['STN, YYYYMMDD, FHX'])
    for row in in_file:
        skip = False
        for i in range(len(row)):
            if "#" in row[i]:
                skip = True
                break
            else:
                row[i] = row[i].strip(" ")

        if not skip:
            out_file.writerow(row)


    return out_file



def convert_csv_json(file):

    in_file = open('wind.csv', 'r')
    out_file = open('file.json', 'w')

    fieldnames = ("STN","YYYYMMDD","FHX")
    reader = csv.DictReader(in_file, fieldnames, delimiter=",")

    rows = [row for row in reader]
    del rows[0]
    print(rows)
    output = json.dumps(rows)
    out_file.write(output)


    return out_file

if __name__ == "__main__":

    csv_file = convert_txt_csv("wind.txt", "wind.csv")

    json_file = convert_csv_json("wind.csv")
