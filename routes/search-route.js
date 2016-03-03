/**
 * Created by silver_android on 02/03/16.
 */
module.exports = function (app) {
    var searchEngine = require('../lib/search.js');

    app.get('/search', function (req, res) {
        searchEngine.search(req.query['search'], function (result) {
            res.status(result['status']);
            res.json(result);
        })
    })
};