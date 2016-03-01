import json

json_data = open('popular_movies_data.json').read()
movie_data = json.loads(json_data)

json_file_data = open('popular_movies_runtimes.json').read()
runtime_data = json.loads(json_file_data)

movies = []

for movie in movie_data:
    for runtime in runtime_data:
        if runtime['id'] == movie['id']:
            movie['runtime'] = runtime['runtime']
            movies.append(movie)

with open('popular_movies_runtimes_merged.json', 'w') as outfile:
    print(movies)
    print('Writing to JSON file...')
    json.dump(movies, outfile)
    print('Completed writing to JSON file...')