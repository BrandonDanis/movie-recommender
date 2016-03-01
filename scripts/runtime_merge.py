import json
import os

import sys

arguments = sys.argv

i = arguments[1]

json_data = open('popular_movies_data_' + str(i) + '.json').read()
movie_data = json.loads(json_data)

json_file_data = open('popular_movies_runtimes_' + str(i) + '.json').read()
runtime_data = json.loads(json_file_data)

movies = []

for movie in movie_data:
    for runtime in runtime_data:
        if runtime['id'] == movie['id']:
            movie['runtime'] = runtime['runtime']
            movies.append(movie)

with open('popular_movies_runtimes_merged_' + str(i) + '.json', 'w') as outfile:
    print(movies)
    print('Writing to JSON file...')
    json.dump(movies, outfile)
    print('Completed writing to JSON file...')
    os.remove('popular_movies_data_' + str(i) + '.json')
    os.remove('popular_movies_runtimes_' + str(i) + '.json')