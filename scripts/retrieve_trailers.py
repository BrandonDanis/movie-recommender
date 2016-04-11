import psycopg2
import requests
import sys

import time


def get_trailer(moviedb_id):
    print moviedb_id
    run = True
    trailer_link = ''
    while run:
        try:
            trailer_json = requests.get(
                'https://api.themoviedb.org/3/movie/' + str(moviedb_id) + '/videos?api_key=' + api_key).json()
        except ValueError as e:
            if e.message == 'No JSON object could be decoded':
                print 'A 502 error may have occurred...waiting 5 seconds to see if it will clear up'
                time.sleep(5)
                print 'Waited 5 seconds'
                run = True
                continue
        try:
            results_length = len(trailer_json['results'])
            run = False
        except KeyError:
            print trailer_json
            if trailer_json['status_code'] == 25:
                print 'Waiting 5 seconds because went over request limit...'
                time.sleep(5)
                run = True
                print 'Waited 5 seconds'
            else:
                return

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
        run = True
        while run:
            try:
                db.execute('UPDATE movies SET trailer=%s WHERE moviedb_id=%s RETURNING *',
                           (trailer_link['key'], moviedb_id))
                connection.commit()
                run = False
            except psycopg2.DataError:
                connection.rollback()
                print 'Updated trailer column to have ' + str(len(trailer_link['key'])) + ' characters'
                db.execute('ALTER TABLE movies ALTER COLUMN trailer TYPE VARCHAR(%s);', (len(trailer_link['key']),))
                connection.commit()
                run = True


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

    db.execute('SELECT moviedb_id, trailer FROM movies ORDER BY id')
    rows = db.fetchall()
    for row in rows:
        if row[1] is None:
            get_trailer(row[0])
        else:
            print 'Trailer already given'
