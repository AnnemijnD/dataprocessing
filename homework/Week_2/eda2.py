# Script that uses EDA
# Annemijn Dijkhuis 11149272


import pandas as pd
import csv
from math import ceil
import matplotlib.pyplot as plt
import json
import numpy as np

INPUT_CSV = "input.csv"
JSNON_EDA = "eda.json"

def load_file(file):
    """
    Loads data of a csv file
    """

    df = pd.read_csv(file)
    return df

def parse(df):
    """
    Deletes rows with empty cells or unknown values
    """

    df.replace('unknown', np.nan, inplace=True)
    df = df.dropna()
    df = df[["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)","GDP ($ per capita) dollars"]]

    return df

def preprocess(df):
    """
    Preprocesses the data
    """

    df["GDP ($ per capita) dollars"] = pd.to_numeric(df["GDP ($ per capita) dollars"].str.strip("dollars"), downcast="integer")
    df['Country'] = df['Country'].str.rstrip()
    df['Region'] = df['Region'].str.rstrip()

    df['Pop. Density (per sq. mi.)'] = pd.to_numeric(df['Pop. Density (per sq. mi.)'].str.replace(',', '.'))
    df["Infant mortality (per 1000 births)"] = pd.to_numeric(df["Infant mortality (per 1000 births)"].str.replace(',', '.'))

    df = df[df.Country != "Suriname"]


    # # print(data_frame['GDP ($ per capita)'])
    mean_GDP = df['GDP ($ per capita) dollars'].mean()
    # stdev_GDP = df['GDP ($ per capita)'].std()
    print(int(mean_GDP))
    # # print(stdev_GDP)
    plt.boxplot(df['GDP ($ per capita) dollars'])
    plt.show()

    # plt.show(df.boxplot(column=['GDP ($ per capita) dollars']))
    df = df.set_index('Country')
    json_format = df.to_json(JSON_EDA, orient="index")



if __name__ == "__main__":
    load_file(INPUT_CSV)
