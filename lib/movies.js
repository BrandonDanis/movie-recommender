

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

	moviesFromAZ: function(callback){
		db.raw('SELECT * FROM movies m ORDER BY m.title').rows(function(err,rows){
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

	moviesFromZA: function(callback){
		db.raw('SELECT * FROM movies m ORDER BY m.title DESC').rows(function(err,rows){
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

	moviesByRelease: function(callback){
		db.raw('SELECT * from movies ORDER BY movies.release_date DESC').rows(function(err,rows) {
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

			db.raw('SELECT movies.id,movies.overview,movies.release_date,movies.poster,movies.title,genres.name AS genre FROM movies,genres,movies_genres WHERE movies.id = movies_genres.movie_id AND genres.id = movies_genres.genre_id AND movies.title = $1',[movieTitle]).rows(function(err,rows){
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
		},

		getMostPopularByGenre: function(callback) {
			module.exports.genres.getAll(function(genres) {
				if(genres['status'] == 200){

					var genresArray = genres['genres'];

					var popularMovies = [];

					for(var i=0;i<genresArray.length;i++){

						db.raw('SELECT m.id, m.poster, g.name FROM movies m,movies_genres mg,genres g WHERE mg.movie_id = m.id AND mg.genre_id = g.id AND g.name = $1 ORDER BY m.rating LIMIT 1',[genresArray[i]['name']]).rows(function(err,rows){
							if(!err){

								popularMovies.push(rows[0]);

							}else{
								console.log(err);
								console.log('Failed to a popular movie for this genre');
							}

							if(popularMovies.length == genresArray.length)
								callback({status: 200, movies: popularMovies});

						});

					}

				}else{
					callback({status: 500, reason: 'Database error'});
				}
			});
		}

	},

	getTrailer: {

		byId: function (movieId, callback) {
			db.raw('SELECT trailer FROM movies WHERE id = $1', [movieId]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						callback({status:200, trailer:row});
					} else {
						callback({status:404, error:'Trailer not found'})
					}
				} else {
					callback({status:500, error:'Database error'});
				}
			});
		},

		byTitle: function (movieTitle, callback) {
			db.raw('SELECT trailer FROM movies WHERE title = $1', [movieTitle]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						callback({status:200, trailer:row});
					} else {
						callback({status:404, error:'Trailer not found'});
					}
				} else {
					callback({status:500, error:'Database error'});
				}
			});
		}
	},

    getPopularMultiGenre: {

		getInitialList: function (genres, callback) {
			var genreString = 'g.id = ' + genres[0];
			for (var i = 1; i < genres.length; i++) {
				genreString += ' OR g.id = ' + genres[i];
			}
			var query = 'SELECT DISTINCT(m.id), m.title, m.poster FROM movies m,movies_genres mg,genres g, ' +
				'ratings r WHERE mg.movie_id = m.id AND mg.genre_id = g.id AND r.movie_id = m.id AND (' +
				genreString + ') LIMIT 10;';

			db.raw(query).rows(function (err, rows) {
				if (!err) {
					if (rows[0] != null) {
						module.exports.getRatings(rows, function (result) {
							if (result['status'] == 200 && rows.length != 10) {
								module.exports.getPopularMultiGenre.getMoreMovies(query, rows,
									function (result) {
										callback(result);
									});
							} else {
								callback(result);
							}
						});
					} else {
						console.log('initialList: 404'.yellow);
						module.exports.getPopularMultiGenre.getMoreMovies(query, [], function (result) {
							callback(result);
						});
					}
				} else {
					console.log('initialList: 500'.red);
					console.error(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		getMoreMovies: function (query, movies, callback) {
			var limit = 10 - movies.length;
			console.log('getMoreMovies: ' + limit);
			db.raw(query.replace(' AND r.movie_id = m.id', '').replace('LIMIT 10', 'LIMIT ' + limit)).rows
			(function (err, rows) {
				if (!err) {
					if (rows[0] != null) {
						if (movies.length != 0)
							rows = rows.concat(movies);
						module.exports.getRatings(rows, function (result) {
							callback(result);
						});
					} else {
						if (movies.length != 0) {
							console.log('getMoreMovies: 404'.yellow);
							callback({status: 200, movies: movies});
						} else {
							callback({status: 404, error: 'No movies exist for genres ' + genres.join(', ')});
						}
					}
				} else {
					if (movies.length != 0) {
						console.log('getMoreMovies: 500'.red);
						callback({status: 200, movies: movies});
					} else {
						callback({status: 500, error: 'Database error'});
					}
				}
			});
		}
	},
	
	getRatings: function (rows, callback) {
		var movieString = 'movie_id = ' + rows[0]['id'];
		var json = [{id: rows[0]['id'], title: rows[0]['title'], poster: rows[0]['poster']}];
		for (var i = 1; i < rows.length; i++) {
			movieString += " OR movie_id = " + rows[i]['id'];
			json.push({id: rows[i]['id'], title: rows[i]['title'], poster: rows[i]['poster']});
		}
		console.log(json);
		db.raw('SELECT AVG(rating) AS average, count(rating) AS total FROM ratings WHERE (' + movieString + ') GROUP BY movie_id;').rows(function (err, ratings) {
			if (!err) {
				if (ratings[0] != null) {
					for (var i = 0; i < ratings.length; i++) {
						json[i]['rating'] = parseFloat((+ratings[i]['average']).toFixed(2));
						json[i]['votes'] = ratings[i]['total'];
					}
					console.log(json);
					callback({status: 200, movies: json});
				} else {
					callback({status: 404, error: 'No ratings could be found', movies: json});
				}
			} else {
				callback({status: 500, error: 'Database error'});
			}
		});
	}
};
