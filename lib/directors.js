/**
 * Created by silver_android on 01/03/16.
 */
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure(dbUrl);

module.exports = {

    getAll: function (callback) {
        db.select().from('directors').rows(function (err, rows) {
            if (!err) {
                if (rows[0]) {
                    callback({status: 200, directors: rows});
                } else {
                    callback({status: 404, error: 'No directors found'});
                }
            } else if (err.message == 'Expected a row, none found') {
                callback({status: 404, error: 'No directors found'});
            } else {
                console.error(err);
                callback({status: 500, error: 'Database error'});
            }
        });
    },

    findSpecificDirector: {

        byID: function (directorID, callback) {
            db.select().from('directors').where({id: directorID}).row(function (err, row) {
                if (!err) {
                    if (row) {
                        callback({status: 200, director: row});
                    } else {
                        callback({status: 404, error: 'No director found'})
                    }
                } else if (err.message == 'Expected a row, none found') {
                    callback({status: 404, error: 'No director found'});
                } else {
                    console.error(err);
                    callback({status: 500, error: 'Database error'});
                }
            });
        },

        byName: function (directorName, callback) {
            db.select().from('directors').where({name: directorName}).row(function (err, row) {
                if (!err) {
                    if (row) {
                        callback({status: 200, director: row});
                    } else {
                        callback({status: 404, error: 'No director found'});
                    }
                } else if (err.message == 'Expected a row, none found') {
                    callback({status: 404, error: 'No director found'});
                } else {
                    console.error(err);
                    callback({status: 500, error: 'Database error'});
                }
            });
        },

        byMovieId: function (movieId, callback) {
            db.raw('SELECT d.name, d.id FROM directors d, movies_directors md WHERE md.director_id = d.id AND md.movie_id = $1 LIMIT 1', [movieId]).row(function (err, row) {
                if (!err) {
                    if (row != null) {
                        callback({status: 200, director: row});
                    } else {
                        callback({status: 404, error: 'No director found'});
                    }
                } else if (err.message == 'Expected a row, none found') {
                    callback({status: 404, error: 'No director found'});
                } else {
                    console.error(err);
                    callback({status: 500, error: 'Database error'});
                }
            });
        }

    },

    getMoviesDirected: function (movieDB_ID, callback) {
        db.select('m.title, m.poster, m.id').from('movies m').join('movies_directors md').on('md.movie_id', 'm.id')
            .join('directors d').on('d.id', 'md.director_id').where({'d.moviedb_id': movieDB_ID}).rows(
            function (err, rows) {
                if (!err) {
                    if (rows[0] != null) {
                        callback({status:200, movies: rows});
                    } else {
                        callback({status:404, error:'Director has not directed any movies'});
                    }
                } else {
                    callback({status:500, error:'Database error'});
                }
            });
    }
};
