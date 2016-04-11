
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure(dbUrl);

module.exports = {

	getCasts: {

		byMovieTitle: function(movieTitle, callback){
			db.raw('SELECT c.id, c.name, c.moviedb_id, mc.character FROM casts c, movies_casts mc, movies m WHERE mc.cast_id = c.id AND mc.movie_id = m.id AND m.title = $1',[movieTitle]).rows(function(err,rows) {
				if(!err){
					if(rows[0] != null){
						callback({status: 200, casts: rows});
					}else{
						callback({status: 404, error: 'No casts found'});
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		byMovieId: function(movieId, callback){
			db.raw('SELECT c.id, c.name, c.moviedb_id, mc.character FROM casts c, movies_casts mc WHERE mc.movie_id = $1 AND mc.cast_id = c.id',[movieId]).rows(function(err,rows) {
				if(!err){
					if(rows[0] != null){
						callback({status: 200, casts: rows});
					}else{
						callback({status: 404, error: 'No casts found'});
					}
				}else{
					console.log(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		}

	},

	findSpecificCast: {

		byId: function (id, callback) {
			db.select().from('casts').where({id: id}).row(function (err, row) {
				if (!err) {
					if (row) {
						callback({status: 200, cast: row});
					} else {
						callback({status: 404, error: 'No actor found'})
					}
				} else if (err.message == 'Expected a row, none found') {
					callback({status: 404, error: 'No actor found'});
				} else {
					console.error(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		},
		
		byName: function (name, callback) {
			db.select().from('casts').where({name: name}).row(function (err, row) {
				if (!err) {
					if (row) {
						callback({status: 200, cast: row});
					} else {
						callback({status: 404, error: 'No actor found'})
					}
				} else if (err.message == 'Expected a row, none found') {
					callback({status: 404, error: 'No actor found'});
				} else {
					console.error(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		}
	},

	getMoviesPlayed: function (movieDB_ID, callback) {
		db.select('m.title, m.poster, m.id').from('movies m').join('movies_casts mc').on('mc.movie_id', 'm.id')
			.join('casts c').on('c.id', 'mc.cast_id').where({'c.moviedb_id': movieDB_ID}).rows(
			function (err, rows) {
				if (!err) {
					if (rows[0] != null) {
						callback({status:200, movies: rows});
					} else {
						callback({status:404, error:'Director has not directed any movies'});
					}
				} else {
					callback({status:500, error:'Database error'});
				}
			});
	}
};
