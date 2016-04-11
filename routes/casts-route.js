


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

	app.get('/cast', function (req, res) {
		var queries = req.query;

		if (queries['id']) {
			casts.findSpecificCast.byId(queries['id'], function (status) {
				if (status['status'] == 200) {
					console.log("Actor found".green);
				}

				res.json(status);
			});
		} else if (queries['name']) {
			casts.findSpecificCast.byName(queries['name'], function (status) {
				if (status['status'] == 200) {
					console.log("Actor found".green);
				}

				res.json(status);
			});
		} else {
			res.status(400).json({status: 400, reason: 'Improper parameters'});
		}
	});
	
	app.get('/cast/movies', function (req, res) {
		if (req.query['uniqueID'] != null) {
			casts.getMoviesPlayed(req.query['uniqueID'], function (result) {
				res.json(result);
			});
		} else {
			res.status(400).json({status:400, error: 'Improper parameters'});
		}
	});
};
