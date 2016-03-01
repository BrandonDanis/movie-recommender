var fs = require('fs');
var colors = require('colors');

// var dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL + '?ssl=true' : '/var/run/postgresql/';
var dbUrl = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure(dbUrl);

var MOVIES_FILENAME = 'movies.json';
var contentJSON = fs.readFileSync(MOVIES_FILENAME);
var moviesArray = JSON.parse(contentJSON);

var GENRES_FILENAME = 'genres.json';
var genresJSON = fs.readFileSync(GENRES_FILENAME);
var genresArray = JSON.parse(genresJSON);

var genresDict = {
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
};

var movieGenresDict = {};

for (var i = 0; i < moviesArray.length; ++i) {

    var movieToAdd = {
        overview: moviesArray[i]['overview'],
        release_date: moviesArray[i]['release_date'],
        runtime: moviesArray[i]['runtime'],
        poster: moviesArray[i]['poster'],
        rating: 0,
        moviedb_id: moviesArray[i]['id'],
        title: moviesArray[i]['title']
    };

    movieGenresDict[moviesArray[i]['title']] = moviesArray[i]['genre_ids'];

    db.insert('movies', movieToAdd).returning('*').rows(function (err, rows) {
        if (!err) {
            if (rows[0] != null) {
                console.log((rows[0].title + ' added | id: ' + rows[0].id).green);

                var movieObject = rows[0];

                addMovieGenreRelation(movieObject, movieGenresDict[movieObject.title]);

            } else {
                console.log('404: Uh-Oh'.red);
            }
        } else {
            if (err['code'] == 23505) {
                console.log('Movie already in databse'.yellow);
            } else {
                console.log(err);
            }
        }
    });

}

addMovieGenreRelation = function (movieObject, genresArray) {

    var movieId = movieObject.id;
    var movieTitle = movieObject.title;

    for (var k = 0; k < genresArray.length; k++) {

        db.select().from('genres').where('name', genresDict[genresArray[k]]).rows(function (err, rows) {
            if (!err) {

                var genreId = rows[0]['id'];
                var genreName = rows[0]['name'];

                var genre_movie = {
                    movie_id: movieId,
                    genre_id: genreId,
                };

                db.insert('movies_genres', genre_movie).returning('*').rows(function (err, rows) {
                    if (!err) {
                        // console.log("Movie-Genre relationship created".green);
                        console.log((movieTitle + ' --> ' + genreName).yellow);
                    } else {
                        console.log("Error: Can't add movie_genre relation".red);
                    }
                });

            } else {
                console.log("Error: Can't find genre".red);
            }
        });
    }

}
