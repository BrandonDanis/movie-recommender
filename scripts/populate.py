import psycopg2
import json

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

i = 1
while i < 11:
    print i
    file_name = 'popular_movies_runtimes_merged_' + str(i) + '.json'
    f = open(file_name, 'r').read()
    movie_data = json.loads(f)

    connection = psycopg2.connect(database='netflix2', user='silver_android', password='pokemonxy3DS',
                                  host='localhost')
    db = connection.cursor()

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
                'INSERT INTO movies (overview, release_date, runtime, poster, rating, moviedb_id, title) VALUES '
                '(%s, %s, %s, %s, %s, %s, %s) RETURNING *', (
                movie['overview'], movie['release_date'], movie['runtime'], movie['poster'], movie['rating'],
                movie['moviedb_id'], movie['title']))
            connection.commit()

            row = db.fetchone()
            movie['id'] = row[0]
            print(row[7] + ' added | id: ' + str(row[0]))

            for genreID in movie['genre_ids']:
                db.execute('SELECT id FROM genres WHERE name=%s', (genresDict[genreID],))
                row = db.fetchone()
                if movie['title'] == 'Ice Age: A Mammoth Christmas':
                    print(str(genreID) + '\n' + str(row))

                genre_movie = {
                    'movie_id': movie['id'],
                    'genre_id': row[0]
                }

                db.execute('INSERT INTO movies_genres VALUES (%s, %s)', (genre_movie['movie_id'], genre_movie['genre_id']))
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

    i += 1
