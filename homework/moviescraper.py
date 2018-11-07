#!/usr/bin/env python
# Name: Annemijn Dijkhuis
# Student number: 11149272
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # Extracts all single movie elements
    list_of_movies = dom.findAll("div", {"class": "lister-item-content"})

    # A dataset list with lists of rows
    dataset = []

    for movie in list_of_movies:

        # A list containing the information of the movie
        row = []

        # Find the title, rating, release date of the movie
        title = movie.h3.a.text
        row.append(title)
        rating = movie.div.div['data-value']
        row.append(rating)
        release_date = movie.find("span", {"class": "lister-item-year text-muted unbold"}).text.strip("(").strip(")").strip("I").strip(") (")
        row.append(release_date)

        # Find the actors that starred in the movie
        actors_movie = []
        for link in movie.findAll('a'):
            # 'st' was present in all links refering to stars
            if "_st_" in link.get("href"):
                actors_movie.append(link.text)

        # Make a string of all the actors in the list
        str_actors_movie = ", ".join(actors_movie)
        row.append(str_actors_movie)

        # Find duration of the movie
        duration = movie.find("span", {"class": "runtime"}).text.strip("min")
        row.append(duration)
        dataset.append(row)
    return (dataset)


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """

    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for movie in movies:
        writer.writerow(movie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
