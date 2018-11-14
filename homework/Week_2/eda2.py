# Script that uses EDA
# Annemijn Dijkhuis 11149272


import pandas as pd
import csv
from math import ceil
import matplotlib.pyplot as plt
import json
import numpy as np

INPUT_CSV = "input.csv"
JSON_EDA = "eda.json"

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
    return df


def preprocess(df):
    """
    Preprocesses the data
    """

    df = df[["Country", "Region", "Pop. Density (per sq. mi.)",
            "Infant mortality (per 1000 births)","GDP ($ per capita) dollars"]]
    df["GDP ($ per capita) dollars"] = pd.to_numeric(df["GDP ($ per capita) dollars"].str.strip("dollars"), downcast="integer")
    df['Country'] = df['Country'].str.rstrip()
    df['Region'] = df['Region'].str.rstrip()

    df['Pop. Density (per sq. mi.)'] = pd.to_numeric(df['Pop. Density (per sq. mi.)'].str.replace(',', '.'))
    df["Infant mortality (per 1000 births)"] = pd.to_numeric(df["Infant mortality (per 1000 births)"].str.replace(',', '.'))

    df = df[df.Country != "Suriname"]

    return df

def central_tendency(df):
    """
    Calculates mean, standard deviation,and mode. Also plots a histogram of a dataframe
    """

    mean_GDP = int(df['GDP ($ per capita) dollars'].mean())
    stdev_GDP = int(df['GDP ($ per capita) dollars'].std())
    mode_GDP = int(df['GDP ($ per capita) dollars'].mode()[0])
    print(mean_GDP)
    print(stdev_GDP)
    print(mode_GDP)

    plt.hist(df['GDP ($ per capita) dollars'])
    plt.title("GDP ($ per capita) in dollars in 170 countries")
    plt.xlabel("GDP ($ per capita) in dollars")
    plt.ylabel("Frequency")
    plt.ylim(ymin=0)
    plt.xlim(xmin=0)
    plt.grid(axis='y')

    return plt.show()


def boxplot_df(df):
    """
    Plots a boxplot of a dataframe
    """

    plt.boxplot(df['Infant mortality (per 1000 births)'])
    plt.xlabel("")
    plt.ylim(ymin=0)
    plt.title("Infant mortality in different countries")
    plt.ylabel("Infant mortality per 1000 births")
    plt.xlabel("Several Countries")
    plt.grid()



    return plt.show()


def json_file(df):
    df = df.set_index('Country')
    return df.to_json(JSON_EDA, orient="index")


if __name__ == "__main__":
    df = load_file(INPUT_CSV)
    df = parse(df)
    df = preprocess(df)
    central_tendency(df)
    boxplot_df(df)
    json_file(df)
