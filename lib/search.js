/**
 * Created by silver_android on 02/03/16.
 */

var dbUrl = process.env.DATABASE_URL;
//var dbUrl = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure(dbUrl);

module.exports = {
    search: function (query, callback) {
        db.raw('SELECT * FROM movies WHERE LOWER(title) LIKE LOWER(\'%' + query + '%\') LIMIT 5;').rows(function (err, rows) {
            if (!err) {
                if (rows[0] != null) {
                    callback({status: 200, movies: rows});
                } else {
                    callback({status: 404, error: 'Movie not found'})
                }
            } else {
                console.error(err);
                callback({status: 500, error: 'Database error'});
            }
        });
    }
};
