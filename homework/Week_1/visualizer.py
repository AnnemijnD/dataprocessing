#!/usr/bin/env python
# Name: Annemijn Dijkhuis
# Student number: 11149272
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from matplotlib.ticker import FormatStrFormatter


# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


def load_file():
    """
    Loads data of a csv file into data_dict
    """

    # Open file
    with open(INPUT_CSV, 'r') as file:
        reader = csv.reader(file)

        # Load data into dictionary
        for line in reader:
            if line[2] in data_dict:
                year = line[2]
                data_dict[line[2]].append(float(line[1]))


def average():
    """
    Returns al list of averages of the values found for each key in data_dict
    """

    averages_list = []

    # Calculate the average of the values for each key
    for year in range(START_YEAR, END_YEAR):
        data_list = data_dict[str(year)]
        average = round(sum(data_list)/len(data_list), 1)
        averages_list.append(average)

    return averages_list


def plot(averages):
    """
    Returns a plot displaying the keys and the average values
    """

    list_years = []

    # Create a list of all keys
    for year in range(START_YEAR, END_YEAR):
        list_years.append(year)

    # Format y axis to show floats with one decimal
    fig, ax = plt.subplots()
    ax.yaxis.set_major_formatter(FormatStrFormatter('%.1f'))

    # Plot
    plt.plot(list_years, averages)
    plt.xticks(range(START_YEAR, END_YEAR, 1), fontsize=10)
    plt.xlabel("Year", fontsize=14)
    plt.ylabel("Average rating", fontsize=14)
    plt.title("Average movie rating per year", fontsize=16)
    return plt.show()


if __name__ == "__main__":
    load_file()
    plot(average())
