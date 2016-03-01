
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
					callback({status: 500, error: 'Database error'});
				}
			});
		}
	}

}
