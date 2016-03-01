import requests
import json

import sys

arguments = sys.argv

i = int(arguments[1])
init = i
movies = []
movie_json = {}

file_name = 'popular_movies_data_' + arguments[2] + '.json'

try:
    while i < (init + 10):
        movie_load = requests.get(
            'https://api.themoviedb.org/3/movie/popular?api_key=476bbe4282fb66cfbd54f6da2d3d28fe&page=' + str(i))
        movie_json_array = movie_load.json()['results']
        print(movie_json_array)
        for movie_json in movie_json_array:
            movie = {'id': movie_json['id'], 'overview': movie_json['overview'],
                     'release_date': movie_json['release_date'], 'poster': movie_json['poster_path'],
                     'title': movie_json['title'], 'genre_ids': movie_json['genre_ids']}
            movies.append(movie)
            print(movie)
        i += 1
finally:
    print('Ended at ' + str(i))
    with open(file_name, 'w') as outfile:
        print('Writing to JSON file...')
        json.dump(movies, outfile)
        print('Completed writing to JSON file...')
