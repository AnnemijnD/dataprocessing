# Script that uses EDA
# Annemijn Dijkhuis 11149272


import pandas as pd
import csv
from math import ceil
import matplotlib.pyplot as plt
import json

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
                if column == '' or column == 'unknown' or column == "Suriname ":
                    delete = True
                    break
            try:
                line[8] = line[8].strip(" dollars")
                line[1] = line[1].rstrip()
                line[0] = line[0].rstrip()
            except:
                pass

            for i in range(len(line)):

                if (line[i].split(',')[0]).isdigit():
                    line[i] = line[i].replace(',','.')
                    if i == 2 or i == 3 or i == 8:
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

    # print(data_dict)
    # print(counter)

    df = pd.read_csv(OUTPUT_CSV, usecols=["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)","GDP ($ per capita)"])

    print(df)
    # print(data_frame['GDP ($ per capita)'])
    mean_GDP = df['GDP ($ per capita)'].mean()
    stdev_GDP = df['GDP ($ per capita)'].std()
    # print(mean_GDP)
    # print(stdev_GDP)
    # plt.boxplot(df['GDP ($ per capita)'])
    plt.show(df.boxplot(column=['GDP ($ per capita)']))
    df = df.set_index('Country')
    json_format = df.to_json("sample.json", orient="index")





if __name__ == "__main__":
    load_file()
