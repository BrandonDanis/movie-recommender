import requests
import json

i = 1
movies = []
movie_json = {}

try:
    # while i < 100000:
    while i < 10:
        movie_load = requests.get(
            'https://api.themoviedb.org/3/movie/popular?api_key=476bbe4282fb66cfbd54f6da2d3d28fe&page=' + str(i))
        movie_json_array = movie_load.json()['results']
        print(movie_json_array)
        for movie_json in movie_json_array:
            movie = {}
            movie['id'] = movie_json['id']
            movie['overview'] = movie_json['overview']
            movie['release_date'] = movie_json['release_date']
            movie['poster'] = movie_json['poster_path']
            movie['title'] = movie_json['title']
            movie['genre_ids'] = movie_json['genre_ids']
            movies.append(movie)
            print(movie)
        i += 1
finally:
    print('Ended at ' + str(i))
    with open('popular_movies_data.json', 'w') as outfile:
        print('Writing to JSON file...')
        json.dump(movies, outfile)
        print('Completed writing to JSON file...')
