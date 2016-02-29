
module.exports = function(app) {

	var movies = require('../lib/movies.js');

	app.get('/movies', function(req,res) {

		movies.getAll(function(status) {
			if(status['status'] == 200){
				console.log("All movies found".green);
				res.json(status);
			}else{
				res.json(status);
			}
		});

	});

	app.get('/specific-movie', function(req,res) {
		if(req.query.id != null){
			movies.findSpecificMovie.byId(req.query.id, function(status) {
				if(status['status'] == 200){
					console.log("Specific movie found".green);
					res.json(status);
				}else{
					res.json(status);
				}
			});
		}else if(req.query.title != null){
			movies.findSpecificMovie.byTitle(req.query.title, function(status) {

			});
		}else{
			res.json({status: 400, reason: 'Improper parameters'});
		}
	});

}
