/**
 * Created by silver_android on 01/03/16.
 */

var directors = require('../lib/directors.js');

module.exports = function(app) {

    app.get('/directors', function(req, res) {

        directors.getAll(function (result) {
            if (result['status'] == 200) {
                console.log("All directors found".green);
            }

            res.status(result['status']);
            res.json(result);
        })
    });

    app.get('/director', function(req, res) {
        var queries = req.query;

        if (queries['id']) {
            directors.findSpecificDirector.byID(queries['id'], function (result) {
                if (result['status'] == 200) {
                    console.log("Director found".green);
                }

                res.status(result['status']);
                res.json(result);
            });
        } else if (queries['name']) {
            directors.findSpecificDirector.byName(queries['name'], function (result) {
                if (result['status'] == 200) {
                    console.log("Director found".green);
                }
                
                res.status(result['status']);
                res.json(result);
            });
        } else {
            res.json({status: 400, reason: 'Improper parameters'});
        }
    })
};
