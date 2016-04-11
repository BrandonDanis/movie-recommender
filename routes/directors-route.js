/**
 * Created by silver_android on 01/03/16.
 */

var directors = require('../lib/directors.js');

module.exports = function(app) {

    app.get('/directors', function(req, res) {

        directors.getAll(function (status) {
            if (status['status'] == 200) {
                console.log("All directors found".green);
            }

            res.status(status['status']);
            res.json(status);
        })
    });

    app.get('/director', function(req, res) {
        var queries = req.query;

        if(queries['id']) {
            directors.findSpecificDirector.byID(queries['id'], function (status) {
                if (status['status'] == 200) {
                    console.log("Director found".green);
                }

                res.json(status);
            });
        }else if(queries['name']) {
            directors.findSpecificDirector.byName(queries['name'], function (status) {
                if (status['status'] == 200) {
                    console.log("Director found".green);
                }

                res.json(status);
            });
        }else if(queries['movieId']){
            directors.findSpecificDirector.byMovieId(queries['movieId'], function(status) {
                if (status['status'] == 200) {
                    console.log("Director found".green);
                }

                res.json(status);
            });
        }else {
            res.json({status: 400, reason: 'Improper parameters'});
        }
    });

    app.get('/director/movies', function (req, res) {
        if (req.query['uniqueID'] != null) {
            directors.getMoviesDirected(req.query['uniqueID'], function (result) {
                res.json(result);
            });
        } else {
            res.status(400).json({status:400, error: 'Improper parameters'});
        }
    });
};
