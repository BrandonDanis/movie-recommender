
var dbUrl = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure( dbUrl );

module.exports = {

	getAllMovies: function(callback){
		db.raw('SELECT * FROM movies').rows(function(err,rows){
			if(!err){
				if(rows[0] != null) {
					callback({status: 200, movies: rows});
				}else{
					callback({status: 404, error: 'No movie found'});
				}
			}else{
				console.log(err);
				callback({status: 500, error: 'Database error'});
			}
		});
	},

	findSpecificMovie: {

		byId: function(movieId,callback) {
			db.raw('SELECT * FROM movies WHERE movies.id = $1',[movieId]).rows(function(err,rows){
				if(!err){
					if(rows[0] != null) {
						callback({status: 200, movie: rows});
					}else{
						callback({status: 404, error: 'No movie found'});
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		byTitle: function(movieTitle, callback) {
			db.raw('SELECT * FROM movies WHERE movies.title = $1',[movieTitle]).rows(function(err,rows){
				if(!err){
					if(rows[0] != null) {
						callback({status: 200, movie: rows});
					}else{
						callback({status: 404, error: 'No movie found'});
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
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

		}

	}

}
