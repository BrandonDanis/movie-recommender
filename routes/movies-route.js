
module.exports = function(app) {

	var movies = require('../lib/movies.js');

	app.get('/movies', function(req,res) {

		movies.getAllMovies(function(status) {
			if(status['status'] == 200){

				

			}else{
				res.json(status);
			}
		});

	});

}
