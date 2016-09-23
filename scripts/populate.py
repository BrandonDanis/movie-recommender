import sys

import psycopg2
import requests
import time


def scrape(init):
    movies = []
    i = init
    while i < (init + 10):
        movie_load = requests.get(
            'https://api.themoviedb.org/3/movie/popular?api_key=476bbe4282fb66cfbd54f6da2d3d28fe&page=' + str(i))
        movie_json_array = movie_load.json()['results']
        print(movie_json_array)
        for movie_json in movie_json_array:
            id = movie_json['id']
            run = True
            while run:
                movie_runtime_json = requests.get(
                    'https://api.themoviedb.org/3/movie/{0}?api_key=476bbe4282fb66cfbd54f6da2d3d28fe'.format(id)).json()
                if 'runtime' not in movie_runtime_json:
                    print('Waiting 5 seconds because going over request limit...')
                    time.sleep(5)
                    run = True
                    print('Finished waiting 5 seconds...')
                else:
                    run = False
            movie = {'id': id, 'overview': movie_json['overview'], 'release_date': movie_json['release_date'],
                     'runtime': movie_runtime_json['runtime'], 'poster': movie_json['poster_path'],
                     'title': movie_json['title'], 'genre_ids': movie_json['genre_ids']}
            movies.append(movie)
            print(movie)
        i += 1
    return movies


args = sys.argv
database = args[1]
host = args[2]
print "Connecting to DB"
if len(args) > 3:
    username = args[3]
    password = args[4]
    connection = psycopg2.connect(database=database, host=host, user=username, password=password)
else:
    connection = psycopg2.connect(database=database, host=host)
db = connection.cursor()
print "Connected to DB"

genresDict = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    10769: "Foreign",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}

movie_data = []
movie_data.extend(scrape(1))
movie_data.extend(scrape(11))

for movie_json in movie_data:
    try:
        movie = {
            'overview': movie_json['overview'],
            'release_date': movie_json['release_date'],
            'runtime': movie_json['runtime'],
            'poster': movie_json['poster'],
            'rating': 0,
            'moviedb_id': movie_json['id'],
            'title': movie_json['title'],
            'genre_ids': movie_json['genre_ids']
        }

        db.execute(
            'INSERT INTO movies (overview, release_date, runtime, poster, moviedb_id, title) VALUES '
            '(%s, %s, %s, %s, %s, %s) RETURNING *', (
                movie['overview'], movie['release_date'], movie['runtime'], movie['poster'], movie['moviedb_id'],
                movie['title']))
        connection.commit()

        row = db.fetchone()
        movie['id'] = row[0]
        print(row[7] + ' added | id: ' + str(row[0]))

        for genreID in movie['genre_ids']:
            db.execute('SELECT id FROM genres WHERE name=%s', (genresDict[genreID],))
            row = db.fetchone()

            genre_movie = {
                'movie_id': movie['id'],
                'genre_id': row[0]
            }

            db.execute('INSERT INTO movies_genres VALUES (%s, %s)',
                       (genre_movie['movie_id'], genre_movie['genre_id']))
            connection.commit()
            print(movie['title'] + ' --> ' + str(genreID))
    except psycopg2.IntegrityError as e:
        print e
        connection.rollback()
        print movie['title'] + ' might already exist...row had to be rollbacked'
    except psycopg2.InternalError as e2:
        print e2
        connection.rollback()
        print movie['title'] + ' failed and had to be rollbacked...'
