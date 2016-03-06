
// Establish db connection
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure( dbUrl );

var bcrypt = require('bcrypt');

module.exports = {

	add: function(username, password, callback){

		var salt = bcrypt.genSaltSync(8);
		var hashedPass = bcrypt.hashSync(password, salt);

		var userToAdd = {
			username: username,
			password: hashedPass
		};

		db.insert('users', userToAdd).returning('*').rows(function(err, rows){
			if(!err){
				if(rows[0] != null){
					console.log('User succesfully created!'.green);
					callback({status: 200, user: rows[0]})
				}else{
					callback({status: 404, error: 'Failed to create user'});
				}
			}else{
				console.error(err);
				callback({status: 500, message: 'Database error'});
			}
		});

	},

	get: {

		byUsername: function(username, callback){
			db.select().from('users').where('username', username).rows(function(err, rows){
				if(!err){
					if(rows[0] != null){
						console.log('User succesfully found!'.green);
						callback({status: 200, user: rows[0]});
					}else{
						callback({status: 404});
					}
				}else{
					callback({status: 500, message: 'Database error'});
				}
			});
		},

		byId: function(userId, callback){
			db.select().from('users').where('id', userId).rows(function(err, rows){
				if(!err){
					if(rows[0] != null){
						console.log('User succesfully found!'.green);
						callback({status: 200, user: rows[0]});
					}else{
						callback({status: 404});
					}
				}else{
					callback({status: 500, message: 'Database error'});
				}
			});
		}

	},

	delete: {

		byUsername: function(username, callback){
			db.delete('users').where('username', username).returning('*').rows(function(err, rows){
				if(!err){
					if(rows[0] != null){
						console.log('User succesfully deleted!'.green);
						callback({status: 200, user: rows[0]});
					}else{
						callback({status: 404});
					}
				}else{
					callback({status: 500, message: 'Database error'});
				}
			});
		},

		byId: function(userId, callback){
			db.delete('users').where('id', userId).returning('*').rows(function(err, rows){
				if(!err){
					if(rows[0] != null){
						console.log('User succesfully deleted!'.green);
						callback({status: 200, user: rows[0]});
					}else{
						callback({status: 404});
					}
				}else{
					callback({status: 500, message: 'Database error'});
				}
			});
		}

	},

    rate: {
        withID: function (username, movieID, rating, callback) {

            db.update('ratings').set({rating: rating}).where({
                username: username,
                movie_id: movieID
            }).returning('rating').row(function (err, row) {
                if (!err) {
                    if (row != null) {
                        console.log(row);
                        callback({status: 200, rating: row['rating']});
                    } else {
                        callback({status: 404, error: 'Failed to find rating to update'});
                    }
                } else {
                    console.log(err);
                    var ratingToAdd = {
                        username: username,
                        movie_id: movieID,
                        rating: rating
                    };

                    db.insert('ratings', ratingToAdd).returning('rating').row(function (err, row) {
                        if (!err) {
                            if (row != null) {
                                console.log(row);
                                callback({status: 200, rating: row['rating']});
                            } else {
                                callback({status: 404, error: 'Failed to give rating to movie'});
                            }
                        } else {
                            console.log(err);
                            callback({status: 500, error: 'Database error'});
                        }
                    });
                }
            });
        },

        withTitle: function (username, movieTitle, rating, callback) {
            var _this = this;
            db.select('id').from('movies').where({title:movieTitle}).row(function (err, row) {
                if (!err) {
                    if (row != null) {
                        _this.withID(username, row['id'], rating, function (res) {
                            callback(res);
                        });
                    } else {
                        callback({status:404, error:'Failed to find movie with title ' + movieTitle});
                    }
                } else {
                    callback({status:500, error: 'Database error'});
                }
            });
        }
    }
};
