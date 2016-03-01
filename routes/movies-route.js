module.exports = function (app) {

    var movies = require('../lib/movies.js');

    app.get('/movies', function(req, res) {
        movies.getAllMovies(function (status) {
            if (status['status'] == 200) {
                console.log("All movies found".green);
                res.json(status);
            } else {
                res.json(status);
            }
        });
    });

    app.get('/specific-movie', function(req, res) {
        if (req.query.id != null) {
            movies.findSpecificMovie.byId(req.query.id, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else if (req.query.title != null) {
            movies.findSpecificMovie.byTitle(req.query.title, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else {
            res.json({status: 400, reason: 'Improper parameters'});
        }
    });

	app.get('/allMovieInfo', function(req,res) {
		if (req.query.id != null) {
            movies.findSpecificMovie.allInfoById(req.query.id, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else if (req.query.title != null) {
            movies.findSpecificMovie.allInfoByTitle(req.query.title, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else {
            res.json({status: 400, reason: 'Improper parameters'});
        }
	});

    app.get('/all-genres', function(req, res) {
        movies.genres.getAll(function (status) {
            if (status['status'] == 200) {
                console.log("All genres found");
                res.json(status);
            } else {
                res.json(status);
            }
        });
    });

    app.get('/getMoviesFromGenre', function(req, res) {
        if (req.query.genreName != null) {
            movies.genres.getMoviesByGenreName(req.query.genreName, function (status) {
                if (status['status'] == 200) {
                    console.log("Movies by genre name found");
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else if (req.query.genreId != null) {
            movies.genres.getMoviesByGenreId(req.query.genreId, function (status) {
                if (status['status'] == 200) {
                    console.log("Movies by genre id found");
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else {
            res.json({status: 400, reason: 'Improper parameters'});
        }
    });

};
