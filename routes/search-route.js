/**
 * Created by silver_android on 02/03/16.
 */
module.exports = function (app) {
    var searchEngine = require('../lib/search.js');

    app.get('/search', function (req, res) {
        var query = req.query['term'];
        if (query != null) {
            searchEngine.search(req.query['term'], function (result) {
                res.status(result['status']);
                res.json(result);
            });
        } else {
            res.status(400);
            res.json({status: 400, reason: 'Improper parameters'});
        }
    })
};