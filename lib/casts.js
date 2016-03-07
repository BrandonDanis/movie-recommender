
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure(dbUrl);

module.exports = {

	getCasts: {

		byMovieTitle: function(movieTitle, callback){
			db.raw('SELECT c.id, c.name, mc.character FROM casts c, movies_casts mc, movies m WHERE mc.cast_id = c.id AND mc.movie_id = m.id AND m.title = $1',[movieTitle]).rows(function(err,rows) {
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
			db.raw('SELECT c.id, c.name, mc.character FROM casts c, movies_casts mc WHERE mc.movie_id = $1 AND mc.cast_id = c.id',[movieId]).rows(function(err,rows) {
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

	}

}
