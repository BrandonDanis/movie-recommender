import psycopg2
import requests

import time


def add_cast_movie_relation(id, cast_id):
    cast_info = cast_info_dict[cast_id]

    cast_movie = {
        'movie_id': cast_info['movie_id'],
        'cast_id': id,
        'character': cast_info['role']
    }

    db.execute('INSERT INTO movies_casts (movie_id, cast_id, character) VALUES (%s, %s, %s) RETURNING *',
               (cast_movie['movie_id'], cast_movie['cast_id'], cast_movie['character']))
    connection.commit()

    row = db.fetchone()
    print(str(row[0]) + ' | ' + row[2] + ' played by ' + str(row[1]) + ' relationship created')


def add_director_movie_relation(movie_id, director_id):
    db.execute('INSERT INTO movies_directors (movie_id, director_id) VALUES (%s, %s) RETURNING *',
               (movie_id, director_id))
    connection.commit()

    row = db.fetchone()
    print(director_info_dict[director_id]['movie'] + ' | ' + str(row[0]) + ' Directed by ' + str(
        row[1]) + ' relationship created')


def get_crew(movie_title, movie_id, moviedb_id):
    print movie_title + ': db id: ' + str(moviedb_id) + ' ' + str(movie_id)
    run = True
    while run:
        credits_json = requests.get(
            'https://api.themoviedb.org/3/movie/' + str(moviedb_id) + '/credits?api_key=' + api_key).json()
        try:
            cast_json = credits_json['cast']
            crew_json = credits_json['crew']
            run = False
        except KeyError:
            print('Waiting 15 seconds because went over request limit...')
            time.sleep(15)
            run = True
            print('Waited 15 seconds')

    for cast in cast_json:
        try:
            cast_add = {
                'name': cast['name'],
                'imageurl': cast['profile_path'],
                'moviedb_id': cast['id']
            }

            cast_info_dict[cast['id']] = {
                'role': cast['character'],
                'movie': movie_title,
                'movie_id': movie_id
            }

            db.execute('INSERT INTO casts (name, imageurl, moviedb_id) VALUES (%s, %s, %s) RETURNING *',
                       (cast_add['name'], cast_add['imageurl'], cast_add['moviedb_id']))
            connection.commit()

            row = db.fetchone()
            print(row[1] + ' added to database')

            add_cast_movie_relation(row[0], row[3])
        except psycopg2.IntegrityError as e2:
            print e2
            connection.rollback()
            print cast['name'] + ' might already exist...row had to be rollbacked'

    for crew in crew_json:
        try:
            if crew['job'] == 'Director':
                director_to_add = {
                    'name': crew['name'],
                    'moviedb_id': crew['id'],
                    'imageurl': crew['profile_path']
                }

                db.execute('INSERT INTO directors (name, imageurl, moviedb_id) VALUES (%s, %s, %s) RETURNING *',
                           (director_to_add['name'], director_to_add['imageurl'], director_to_add['moviedb_id']))
                connection.commit()

                row = db.fetchone()
                print(str(row[0]) + ' added to database')
                director_info_dict[row[0]] = {
                    'movie': movie_title
                }

                add_director_movie_relation(movie_id, row[0])
        except psycopg2.IntegrityError as e:
            print e
            connection.rollback()
            print crew['name'] + ' might already exist...row had to be rollbacked'


cast_info_dict = {}
director_info_dict = {}

api_key = '476bbe4282fb66cfbd54f6da2d3d28fe'

connection = psycopg2.connect(database='netflix2', user='silver_android', password='pokemonxy3DS',
                              host='localhost')
db = connection.cursor()

db.execute('SELECT id,title,moviedb_id FROM movies ORDER BY id')
rows = db.fetchall()
for row in rows:
    get_crew(row[1], row[0], row[2])
