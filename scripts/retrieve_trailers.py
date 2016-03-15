import psycopg2
import requests
import sys

import time


def get_trailer(moviedb_id):
    print moviedb_id
    run = True
    trailer_link = ''
    while run:
        trailer_json = requests.get(
            'https://api.themoviedb.org/3/movie/' + str(moviedb_id) + '/videos?api_key=' + api_key).json()
        try:
            results_length = len(trailer_json['results'])
            run = False
        except KeyError:
            print 'Waiting 5 seconds because went over request limit...'
            time.sleep(5)
            run = True
            print 'Waited 5 seconds'

    if results_length == 1:
        trailer_link = trailer_json['results'][0]
    else:
        for trailer in trailer_json['results']:
            if trailer['type'] == 'Trailer' and ('trailer' in trailer['name'].lower()):
                trailer_link = trailer
                break

    print trailer_link

    if trailer_link == '':
        print 'No videos available for ' + str(moviedb_id)
    else:
        db.execute('UPDATE movies SET trailer=%s WHERE moviedb_id=%s RETURNING *', (trailer_link['key'], moviedb_id))
        connection.commit()


args = sys.argv
database = args[1]
host = args[2]
if len(args) > 3:
    username = args[3]
    password = args[4]
    connection = psycopg2.connect(database=database, host=host, user=username, password=password)
else:
    connection = psycopg2.connect(database=database, host=host)
db = connection.cursor()

api_key = '476bbe4282fb66cfbd54f6da2d3d28fe'

db.execute('SELECT moviedb_id FROM movies ORDER BY id')
rows = db.fetchall()
for row in rows:
    get_trailer(row[0])
