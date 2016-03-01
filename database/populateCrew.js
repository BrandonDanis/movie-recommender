var fs = require('fs');
var colors = require('colors');

var request = require('request');

var API_KEY = '476bbe4282fb66cfbd54f6da2d3d28fe';

// var dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL + '?ssl=true' : '/var/run/postgresql/';
var dbUrl = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure(dbUrl);

var allMovies = [];
var allMoviesId = [];

var movieNameDict = {};

db.raw('SELECT id,title,moviedb_id FROM movies ORDER BY title').rows(function (err, rows) {
    if (!err) {
        if (rows[0] != null) {

            for (var i = 0; i < rows.length - 175; i++) {

                //just incase
                allMovies[i] = rows[i]['title'];
                allMoviesId[i] = rows[i]['moviedb_id'];
                movieNameDict[rows[i]['id']] = allMovies[i];

                getCrew(rows[i]['title'], rows[i]['id'], rows[i]['moviedb_id']);

            }

        } else {
            console.log('No rows returned');
        }
    } else {
        console.log(err);
    }
});

var castInfoDict = {};
var directorInfoDict = {};

getCrew = function (movieTitle, movieId, movieDB_Id) {

    request(('https://api.themoviedb.org/3/movie/' + movieDB_Id + '/credits?api_key=' + API_KEY), function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var parsedBody = JSON.parse(body);
            var crewArray = parsedBody.crew;
            var castArray = parsedBody.cast;

            for (var i = 0; i < castArray.length; i++) {
                //console.log((movieTitle).green + ' | ' + castArray[i]['character'] + (' played by ').yellow + castArray[i]['name']);

                var castToAdd = {
                    name: castArray[i]['name'],
                    imageurl: castArray[i]['profile_path'],
                    moviedb_id: castArray[i]['id']
                };

                castInfoDict[castArray[i]['id']] = {
                    role: castArray[i]['character'],
                    movie: movieTitle,
                    movieId: movieId
                };

                db.insert('casts', castToAdd).returning('*').rows(function (err, rows) {
                    if (!err) {
                        if (rows[0] != null) {
                            console.log((rows[0]['name'] + ' added to the database').green);

                            addCastMovieRelation(rows[0]['id'], rows[0]['moviedb_id']);

                        } else {
                            console.log('Uh-Oh'.red);
                        }
                    } else if (err['code'] == 23505) {
                        console.log(("Already in database").yellow);
                    } else {
                        console.log(err);
                    }
                });

            }

            // for(var x=0;x<crewArray.length;x++){
            // 	if(crewArray[x]['job'] == 'Director'){
            // 		//console.log((movieTitle).green + ' | ' + (' Directed by ').cyan + crewArray[x]['name']);
            // 	}
            // }
            //console.log('');

        } else {
            console.log(body);
        }
    });

};

addCastMovieRelation = function (id, castId) {

    var castInfo = castInfoDict[castId];

    var cast_movie = {
        movie_id: castInfo.movieId,
        cast_id: id,
        character: castInfo.role
    };

    db.insert('movies_casts', cast_movie).returning('*').rows(function (err, rows) {
        if (!err) {
            if (rows[0] != null) {
                console.log((movieNameDict[rows[0]['movie_id']]).cyan + ' | ' + rows[0]['character'] + (' played by ').yellow + rows[0]['cast_id'] + (' relationship created.').green);
            } else {
                console.log('uh oh'.red);
            }
        } else {
            console.log(err.detail);
        }
    });
};

addDirectorMovieRelation = function (id, directorID) {

};
