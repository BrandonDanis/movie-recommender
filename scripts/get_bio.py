import psycopg2
import requests
import sys

import time


def get_person(moviedb_id, include_image, table):
    print(moviedb_id)
    run = True
    while run:
        try:
            people_json = requests.get(
                'https://api.themoviedb.org/3/person/' + str(moviedb_id) + '?api_key=' + api_key).json()
            print(people_json)
        except ValueError as e:
            if e.message == 'No JSON object could be decoded':
                print('A 502 error may have occurred...waiting 5 seconds to see if it will clear up')
                time.sleep(5)
                print('Waited 5 seconds')
                run = True
                continue
        run = False

        try:
            test = people_json['profile_path']
        except KeyError:
            print(people_json)
            if people_json['status_code'] == 25:
                print('Waiting 5 seconds because went over request limit...')
                time.sleep(5)
                run = True
                print('Waited 5 seconds')
            else:
                return

    query = 'UPDATE ' + table + ' SET '
    words = []
    if include_image:
        query += 'imageurl = %s'
        words.append(people_json['profile_path'])
    if people_json['biography'] is not '':
        if include_image:
            query += ', '
        query += 'bio = %s'
        words.append(people_json['biography'])
    print('\'{}\''.format(query))
    if query != ('UPDATE {} SET '.format(table)):
        query += ' WHERE moviedb_id=%s'
        words.append(moviedb_id)
        db.execute(query, words)
        connection.commit()


def begin(table):
    db.execute('SELECT moviedb_id, bio, imageurl FROM ' + table + ' ORDER BY id')
    rows = db.fetchall()
    for row in rows:
        print(row)
        if row[1] is None or row[2] is None:
            get_person(row[0], row[2] is None, table)
        else:
            print('Person already modified')


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

begin('casts')
begin('directors')
