/**
 * Created by silver_android on 01/03/16.
 */
var dbURL = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure(dbURL);

module.exports = {

    getAll: function (callback) {
        db.select().from('public.directors').rows(function (err, rows) {
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
        }
    }
};
