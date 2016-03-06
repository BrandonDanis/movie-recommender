

var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure( dbUrl );

module.exports = {

	getAllMovies: function(callback){
		db.raw('SELECT * FROM movies').rows(function(err,rows){
			if(!err){
				if(rows[0] != null) {
					callback({status: 200, movies: rows});
				}else{
					callback({status: 404, error: 'No movies found'});
				}
			}else{
				console.log(err);
				callback({status: 500, error: 'Database error'});
			}
		});
	},

	findSpecificMovie: {

		byId: function(movieId,callback) {

			db.raw('SELECT movies.id,movies.overview,movies.release_date,movies.poster,movies.title,genres.name AS genre FROM movies,genres,movies_genres WHERE movies.id = movies_genres.movie_id AND genres.id = movies_genres.genre_id AND movies.id = $1',[movieId]).rows(function(err,rows){
				if(!err){
					if(rows[0] != null) {

						movie = {
                            id: rows[0]['id'],
                            overview: rows[0]['overview'],
                            release_date: rows[0]['release_date'],
                            poster: rows[0]['poster'],
                            title: rows[0]['title'],
                            rating: rows[0]['rating']
                        };

						var genres = [];
                        for (var i = 0; i < rows.length; i++) {
                            var genre = rows[i]['genre'];
                            if (genres.indexOf(genre) == -1) {
                                genres.push(genre);
                            } else {
                                break;
                            }
                        }
						movie['genres'] = genres;

						callback({status:200, movie: movie});
					}else{
						callback({status:404, error: 'No movie found'})
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
				}
			});

		},

		byTitle: function(movieTitle,callback) {

			//TODO

		}

	},

	findCompleteMovieInfo: {

		byId: function(movieId,callback) {
            var movie = {};
			console.log(movieId);
            db.select('m.id', 'm.overview', 'm.release_date', 'm.poster', 'm.title', 'g.name AS genre',
                'd.name AS director', 'd.imageurl AS director_image', 'c.name AS cast_name', 'c.imageurl AS cast_image',
                'r.rating').from('movies m').join('movies_genres mg').on('m.id', 'mg.movie_id')
                .join('movies_directors md').on('m.id', 'md.movie_id').join('movies_casts mc').on('m.id', 'mc.movie_id')
                .join('genres g').on('mg.genre_id', 'g.id').join('directors d').on('md.director_id', 'd.id')
                .join('casts c').on('mc.cast_id', 'c.id').join('ratings r').on('r.movie_id', 'm.id')
                .where({'m.id': movieId}).rows(function (err, rows) {
                if (!err) {
                    if (rows[0] != null) {
                        movie = {
                            id: rows[0]['id'],
                            overview: rows[0]['overview'],
                            release_date: rows[0]['release_date'],
                            poster: rows[0]['poster'],
                            title: rows[0]['title'],
                            rating: rows[0]['rating']
                        };
                        movie['director'] = {name: rows[0]['director'], imageurl: rows[0]['director_image']};
                        var genres = [];
                        for (var i = 0; i < rows.length; i++) {
                            var genre = rows[i]['genre'];
                            if (genres.indexOf(genre) == -1) {
                                genres.push(genre);
                            } else {
                                break;
                            }
                        }
                        movie['genres'] = genres;

                        var entire_cast = [];
                        for (var j = 0; j * i < rows.length; j++) {
                            var index = j * i;
                            var row = rows[index];
                            var cast = {name: row['cast_name'], imageurl: row['cast_image']};
                            entire_cast.push(cast);
                        }
                        movie['cast'] = entire_cast;

                        callback({status:200, movie: movie});
                    } else {
                        callback({status:404, error: 'No movie found'});
                    }
                } else {
					console.log(err);
                    callback({status:500, error: 'Database error'});
                }
            });
		},

		byTitle: function(movieTitle, callback) {
            var movie = {};
            console.log(movieTitle);
            db.select('m.id', 'm.overview', 'm.release_date', 'm.poster', 'm.title', 'g.name AS genre',
                'd.name AS director', 'd.imageurl AS director_image', 'c.name AS cast_name', 'c.imageurl AS cast_image')
                .from('movies m').join('movies_genres mg').on('m.id', 'mg.movie_id').join('movies_directors md')
                .on('m.id', 'md.movie_id').join('movies_casts mc').on('m.id', 'mc.movie_id').join('genres g')
                .on('mg.genre_id', 'g.id').join('directors d').on('md.director_id', 'd.id').join('casts c')
                .on('mc.cast_id', 'c.id').where({'m.title': movieTitle}).rows(function (err, rows) {
                if (!err) {
                    if (rows[0] != null) {
                        movie['id'] = rows[0]['id'];
                        movie['overview'] = rows[0]['overview'];
                        movie['release_date'] = rows[0]['release_date'];
                        movie['poster'] = rows[0]['poster'];
                        movie['title'] = rows[0]['title'];
                        movie['director'] = {name: rows[0]['director'], imageurl: rows[0]['director_image']};
                        var genres = [];
                        for (var i = 0; i < rows.length; i++) {
                            var genre = rows[i]['genre'];
                            if (genres.indexOf(genre) == -1) {
                                genres.push(genre);
                            } else {
                                break;
                            }
                        }
                        movie['genres'] = genres;

                        var entire_cast = [];
                        for (var j = 0; j * i < rows.length; j++) {
                            var index = j * i;
                            var row = rows[index];
                            var cast = {name: row['cast_name'], imageurl: row['cast_image']};
                            entire_cast.push(cast);
                        }
                        movie['cast'] = entire_cast;

                        callback({status:200, movie: movie});
                    } else {
                        callback({status:404, error: 'No movie found'})
                    }
                } else {
                    callback({status:500, error: 'Database error'});
                }
            });
		}

	},

	genres: {
		getAll: function(callback) {
			db.raw('SELECT * FROM genres').rows(function(err,rows){
				if(!err){
					if(rows[0] != null) {
						callback({status: 200, genres: rows});
					}else{
						callback({status: 404, error: 'No genres found'});
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		getMoviesByGenreName: function(genreName, callback) {
			db.raw('SELECT movies.id,movies.overview,movies.release_date,movies.runtime,movies.poster,movies.rating,movies.title,genres.name AS genre_name FROM movies,genres,movies_genres WHERE genres.name = $1 AND movies.id = movies_genres.movie_id AND genres.id = movies_genres.genre_id',[genreName]).rows(function(err,rows){
				if(!err){
					if(rows[0] != null) {
						callback({status: 200, movies: rows});
					}else{
						callback({status: 404, error: 'No movies found with that genre name'});
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		getMoviesByGenreId: function(genreId, callback) {
			db.raw('SELECT movies.id,movies.overview,movies.release_date,movies.runtime,movies.poster,movies.rating,movies.title,genres.name AS genre_name FROM movies,genres,movies_genres WHERE genres.id = $1 AND movies.id = movies_genres.movie_id AND genres.id = movies_genres.genre_id',[genreId]).rows(function(err,rows){
				if(!err){
					if(rows[0] != null) {
						callback({status: 200, movies: rows});
					}else{
						callback({status: 404, error: 'No movies found with that genre id'});
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		}

	}
};
