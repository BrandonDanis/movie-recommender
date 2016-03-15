
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

    postRating: {

        withID: function (username, movieID, rating, callback) {
            db.update('ratings').set({rating: rating}).where({
                username: username,
                movie_id: movieID
            }).returning('rating').row(function (err, row) {
                if (!err) {
                    if (row != null) {
                        callback({status: 200, rating: row['rating']});
                    } else {
                        callback({status: 404, error: 'Failed to find rating to update'});
                    }
                } else {
                    var ratingToAdd = {
                        username: username,
                        movie_id: movieID,
                        rating: rating
                    };

                    db.insert('ratings', ratingToAdd).returning('rating').row(function (err, row) {
                        if (!err) {
                            if (row != null) {
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
                        callback({status:404, error:'Failed to find movie with title: ' + movieTitle});
                    }
                } else {
                    callback({status:500, error: 'Database error'});
                }
            });
        }
    },

	getRating: {

		byId: function(username, movieId, callback) {
			db.raw('SELECT r.rating FROM ratings r WHERE r.movie_id = $1',[movieId]).rows(function(err,rows) {
				if(!err){
					if(rows[0] != null){
						var json = {status: 200};
						json['rating'] = rows[0]['rating'];
						module.exports.getAverageRating.byId(username, movieId, function (res) {
							console.log(res);
							if (res.hasOwnProperty('error')) {
								json['status'] = res['status'];
								json['error'] = res['error'];
							} else {
								var result = res['averageRating'];
								json['average'] = +result['average'];
								json['total'] = result['total'];
							}
							callback(json);
						});
					}else{
						callback({status: 404, error:'Failed to find rating with movieId: ' + movieId});
					}
				}else{
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		byTitle: function(username, movieTitle, callback) {
			db.raw('SELECT r.rating FROM ratings r,movies m WHERE r.movie_id = m.id AND m.title = $1',[movieTitle]).rows(function(err,rows) {
				if(!err){
					if(rows[0] != null){
						var json = {status: 200};
						json['rating'] = rows[0]['rating'];
						module.exports.getAverageRating.byTitle(username, movieTitle, function (res) {
							console.log(res);
							if (res.hasOwnProperty('error')) {
								json['status'] = res['status'];
								json['error'] = res['error'];
							} else {
								var result = res['averageRating'];
								json['average'] = result['average'];
								json['total'] = result['total'];
							}
							callback(json);
						});
					}else{
						callback({status: 404, error:'Failed to find rating with movieTitle: ' + movieTitle});
					}
				}else{
					callback({status: 500, error: 'Database error'});
				}
			});
		}

	},

	getAverageRating: {

		byId: function (username, movieId, callback) {
			db.raw('SELECT AVG(rating) AS average, count(rating) AS total FROM ratings WHERE movie_id = $1',[movieId]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						callback({status:200, averageRating: row})
					} else {
						callback({status:404, error: 'Failed to get average rating with movieId: ' + movieId})
					}
				} else {
					callback({status:500, error:'Database error'})
				}
			});
		},

		byTitle: function (username, movieTitle, callback) {
			db.raw('SELECT AVG(rating) AS average, count(rating) AS total FROM ratings WHERE title = $1',[movieTitle]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						callback({status:200, averageRating: row})
					} else {
						callback({status:404, error: 'Failed to get average rating with movieTitle: ' + movieTitle})
					}
				} else {
					callback({status:500, error:'Database error'})
				}
			});
		}
	}

};
