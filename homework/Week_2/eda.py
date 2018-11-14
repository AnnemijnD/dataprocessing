# Script that uses EDA
# Annemijn Dijkhuis 11149272


import pandas as pd
import csv
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

    # Selects columns Country, Region, Pop. Density, Infant mortality and GDP
    df = df[["Country", "Region", "Pop. Density (per sq. mi.)",
             "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]]

    # Converts the data to the right numeric class
    df.loc[:, "GDP ($ per capita) dollars"] = pd.to_numeric(df[
                "GDP ($ per capita) dollars"].str.strip("dollars"),
                downcast="integer", errors="ignore")
    df.loc[:, 'Pop. Density (per sq. mi.)'] = pd.to_numeric(df[
                'Pop. Density (per sq. mi.)'].str.replace(',', '.'))
    df.loc[:, "Infant mortality (per 1000 births)"] = pd.to_numeric(df[
                "Infant mortality (per 1000 births)"].str.replace(',', '.'))

    # Strips unnecessary whitespaces
    df.loc[:, 'Country'] = df['Country'].str.rstrip()
    df.loc[:, 'Region'] = df['Region'].str.rstrip()

    # Deletes outlier Suriname from the data
    df = df.loc[df.Country != "Suriname"]
    return df


def central_tendency(df):
    """
    Calculates mean, standard deviation,and mode. Also plots a histogram of a dataframe
    """

    # Calculates mean, standard deviation and mode
    mean_GDP = int(df['GDP ($ per capita) dollars'].mean())
    stdev_GDP = int(df['GDP ($ per capita) dollars'].std())
    mode_GDP = int(df['GDP ($ per capita) dollars'].mode()[0])
    print(f"Mean: {mean_GDP}")
    print(f"Standard deviation: {stdev_GDP}")
    print(f"Mode: {mode_GDP}")

    # Composes a histogram of the GDP
    plt.hist(df['GDP ($ per capita) dollars'], edgecolor='black', linewidth=1.2)
    plt.title("GDP ($ per capita) in dollars in 170 countries")
    plt.xlabel("GDP ($ per capita) in dollars")
    plt.ylabel("Frequency")
    plt.xticks(list(range(0, 45000, 5000)))
    plt.ylim(ymin=0)
    plt.xlim(xmin=0)
    plt.grid(axis='y')
    return plt.show()


def boxplot_df(df):
    """
    Plots a boxplot of a dataframe
    """

    # Composes a boxplot
    plt.boxplot(df['Infant mortality (per 1000 births)'])
    plt.xlabel("")
    plt.ylim(ymin=0)
    plt.title("Infant mortality in different countries")
    plt.ylabel("Infant mortality per 1000 births")
    plt.xlabel("Several Countries")
    plt.grid()
    return plt.show()


def json_file(df):
    """
    Composes a jsonfile of a data_frame
    """

    df = df.set_index('Country')
    return df.to_json(JSON_EDA, orient="index")


if __name__ == "__main__":

    # Load file
    df = load_file(INPUT_CSV)

    # Parse file
    df = parse(df)

    # Preprocess file
    df = preprocess(df)

    # Compose histogram
    central_tendency(df)

    # Compose boxplot
    boxplot_df(df)

    # Compose json file
    json_file(df)
