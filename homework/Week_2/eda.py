# Script that uses EDA
# Annemijn Dijkhuis 11149272


import pandas
import csv
from math import ceil

INPUT_CSV = "input.csv"
OUTPUT_CSV = "output.csv"
data_dict = {}



def load_file():
    """
    Loads data of a csv file
    """

    counter = 0

    # Open file
    with open(INPUT_CSV, 'r') as file:
        data = []
        reader = csv.reader(file)
        for line in reader:
            row = []
            delete = False
            for column in line:
                if column == '' or column == 'unknown':
                    delete = True
                    break
            try:
                line[8] = line[8].split(' dollars')[0]
            except:
                pass

            for i in range(len(line)):
                if (line[i].split(',')[0]).isdigit():
                    line[i] = line[i].replace(',','.')
                    if i == 7 or i == 4:
                        line[i] = int(ceil(float(line[i])))
                    elif i == 2 or i == 3 or i == 8:
                        line[i] = int(line[i])
                    else:
                        line[i] = float(line[i])

                row.append(line[i])

            if not delete and bool(line):
                data_dict[f'{line[0]}'] = f'{line}'
                data.append(row)
                counter += 1



        with open(OUTPUT_CSV, 'w', newline='') as output_file:
            writer = csv.writer(output_file)
            for row in data:
                writer.writerow(row)

    print(data_dict)
    print(counter)


if __name__ == "__main__":
    load_file()
