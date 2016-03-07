


var casts = require('../lib/casts.js');

module.exports = function(app) {

	app.get('/casts', function(req, res) {

		if(req.query.movieTitle != null){
			casts.getCasts.byMovieTitle(req.query.movieTitle, function(status) {
				if (status['status'] == 200) {
	                console.log("All casts found".green);
	            }

				res.json(status);

			});
		}else if(req.query.movieId != null){
			casts.getCasts.byMovieId(req.query.movieId, function(status) {
				if (status['status'] == 200) {
					console.log("All casts found".green);
				}

				res.json(status);

			});
		}else{
			res.json({status: 400, reason: 'Improper parameters'});
		}

	});

}
