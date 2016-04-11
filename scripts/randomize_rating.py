import psycopg2
import sys
from random import randint

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

db.execute('SELECT * FROM users')
users = db.fetchall()
for user in users:
    username = user[3]
    print 'User: ' + username
    db.execute('SELECT * FROM movies ORDER BY random() LIMIT 50')
    movies = db.fetchall()
    values = '(\'' + username + '\', ' + str(movies[0][0]) + ', ' + str(randint(1, 10)) + ')'
    for i in range(1, len(movies)):
        print i
        print len(movies)
        print 'Movie: ' + movies[i][7]
        movie_id = movies[i][0]
        random_rating = randint(1, 10)
        values += ', (\'' + username + '\', ' + str(movie_id) + ', ' + str(random_rating) + ')'
        i += 1
    db.execute('INSERT INTO ratings (username, movie_id, rating) VALUES ' + values)
    connection.commit()
