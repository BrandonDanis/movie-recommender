module.exports = function (app) {

    var movies = require('../lib/movies.js');

    app.get('/all-movies', function (req, res) {
        movies.getAllMovies(function (status) {
            if (status['status'] == 200) {
                console.log("All movies found".green);
                res.json(status);
            } else {
                res.json(status);
            }
        });
    });

    app.get('/moviesFromA-Z', function (req, res) {
        movies.moviesFromAZ(function (status) {
            if (status['status'] == 200) {
                res.json(status);
            } else {
                res.json(status);
            }
        });
    });

    app.get('/moviesFromZ-A', function (req, res) {
        movies.moviesFromZA(function (status) {
            if (status['status'] == 200) {
                res.json(status);
            } else {
                res.json(status);
            }
        });
    });

    app.get('/moviesByRelease', function (req, res) {
        movies.moviesByRelease(function (status) {
            res.json(status);
        });
    });
    
    app.get('/moviesByPopularity', function (req, res) {
         movies.moviesByPopularity(function (result) {
             res.json(result);
         })
    });

    app.get('/specific-movie', function (req, res) {
        if (req.query.title != null) {
            movies.findSpecificMovie.byTitle(req.query.title, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else if (req.query.id != null) {
            movies.findSpecificMovie.byId(req.query.id, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else {
            res.json({status: 404, reason: 'Improper parameters'});
        }
    });

    app.get('/findAllMovieInfo', function (req, res) {
        if (req.query.title != null) {
            movies.findCompleteMovieInfo.byTitle(req.query.title, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else if (req.query.id != null) {
            movies.findCompleteMovieInfo.byId(req.query.id, function (status) {
                if (status['status'] == 200) {
                    console.log("Specific movie found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else {
            res.json({status: 404, reason: 'Improper parameters'});
        }
    });

    app.get('/all-genres', function (req, res) {
        movies.genres.getAll(function (status) {
            if (status['status'] == 200) {
                console.log("All genres found");
                res.json(status);
            } else {
                res.json(status);
            }
        });
    });

    app.get('/getMoviesFromGenre', function (req, res) {
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
            res.status(400);
            res.json({status: 400, reason: 'Improper parameters'});
        }
    });

    app.get('/getMostPopularByGenre', function (req, res) {
        movies.genres.getMostPopularByGenre(function (status) {
            if (status['status'] == 200) {
                console.log('Found most popular movies by genre');
                res.json(status);
            } else {
                res.json(status);
            }
        });
    });

    app.get('/trailer', function (req, res) {
        if (req.query.title != null) {
            movies.getTrailer.byTitle(req.query.title, function (status) {
                if (status['status'] == 200) {
                    console.log("Trailer found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else if (req.query.id != null) {
            movies.getTrailer.byId(req.query.id, function (status) {
                if (status['status'] == 200) {
                    console.log("Trailer found".green);
                    res.json(status);
                } else {
                    res.json(status);
                }
            });
        } else {
            res.json({status: 404, reason: 'Improper parameters'});
        }
    });

    app.get('/popularMultiGenre', function (req, res) {
        var genres = req.query.genres;
        if (genres != null && genres instanceof Array && genres.length > 2) {
            movies.getPopularMultiGenre.getInitialList(genres, 10, function (result) {
                res.json(result);
            });
        } else if (genres instanceof Array && genres.length < 3) {
            res.status(400).json({status: 400, error: 'You must send a minimum of 3 genres'});
        } else {
            res.status(400).json({status: 400, error: 'Improper parameters'});
        }
    });

    app.get('/popularMultiGenre/after', function (req, res) {
        var limit = req.query.limit;
        if (limit != null) {
            movies.getPopularMultiGenre.afterSetup(req.session.username, limit, function (result) {
               res.json(result);
            });
        } else {
            res.status(400).json({status:400, error:'Improper parameters'});
        }
    });
};
