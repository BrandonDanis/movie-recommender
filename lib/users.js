
// Establish db connection
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure( dbUrl );

var bcrypt = require('bcrypt');

module.exports = {

	add: function(username, password, confirmPassword, email, callback){

		if (password == confirmPassword) {
			var salt = bcrypt.genSaltSync(8);
			var hashedPass = bcrypt.hashSync(password, salt);

			var userToAdd = {
				username: username,
				password: hashedPass,
				email: email,
				status: 'pending'
			};


            db.raw('SELECT username, email FROM users WHERE username = $1 OR email = $2', [username, email]).row(function (err, row) {
                if (!err) {
                    if (row != null) {
                        if (row['username'] == username) {
                            callback({status: 400, error: 'Username already used'});
                        } else if (row['email'] == email) {
                            callback({status: 400, error: 'Email already used'});
                        }
                    } else {
                        callback({status: 404});
                    }
                } else {
                    console.log(err);
                    if (err['message'] == 'Expected a row, none found') {
                        db.insert('users', userToAdd).returning('*').rows(function (err, rows) {
                            if (!err) {
                                if (rows[0] != null) {
                                    console.log('User succesfully created!'.green);
                                    callback({status: 200, user: rows[0]})
                                } else {
                                    callback({status: 404, error: 'Failed to create user'});
                                }
                            } else {
                                console.error(err);
                                callback({status: 500, error: 'Database error'});
                            }
                        });
                    } else {
                        callback({status: 500, error: 'Database error'});
                    }
                }
            });
        } else {
            callback({status: 400, error: 'Passwords do not match'});
        }

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
					callback({status: 500, error: 'Database error'});
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
					callback({status: 500, error: 'Database error'});
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
					callback({status: 500, error: 'Database error'});
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
					callback({status: 500, error: 'Database error'});
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
			db.raw('SELECT r.rating FROM ratings r WHERE r.movie_id = $1 AND r.username=$2',[movieId,username]).rows(function(err,rows) {
				if(!err){
					var json = {status: 200};
					if(rows[0] != null){
						json['rating'] = rows[0]['rating'];
					}else{
						json['rating'] = 0;
					}

					module.exports.getAverageRating.byId(movieId, function (res) {
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
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		byTitle: function(username, movieTitle, callback) {
			db.raw('SELECT r.rating FROM ratings r,movies m WHERE r.movie_id = m.id AND m.title = $1',[movieTitle]).rows(function(err,rows) {
				if(!err){
					var json = {status: 200};
					if(rows[0] != null){
						json['rating'] = rows[0]['rating'];
					}else{
						json['rating'] = 0;
					}

					module.exports.getAverageRating.byTitle(movieTitle, function (res) {
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
					callback({status: 500, error: 'Database error'});
				}
			});
		}
	},

    setup: function (firstName, lastName, favGenres, username, movieIDs, callback) {
        module.exports.setName(firstName, lastName, username, function (result) {
            if (result['status'] == 200) {
                module.exports.setFavouriteGenres(username, favGenres, function (result) {
                    if (result['status'] == 200) {
						var massRatings = [];
						for (var i = 0; i < movieIDs.length; i++) {
							massRatings.push(10);
						}
                        module.exports.postRatings(username, movieIDs, massRatings, function (result) {
                            callback(result);
                        });
                    } else {
                        callback(result);
                    }
                });
            } else {
                callback(result);
            }
        });
    },

    setName: function (firstName, lastName, username, callback) {
        db.update('users').set({'firstname': firstName, 'lastname': lastName}).where({'username': username}).returning('*').row(function (err, row) {
            if (!err) {
                if (row != null) {
                    callback({status:200, user: row});
                } else {
                    callback({status:404, error: 'Failed to update names'});
                }
            } else {
                callback({status:500, error:'Database error'});
            }
        });
    },

    setFavouriteGenres: function (username, favGenres, callback) {
        var selectString = 'id = \'' + favGenres[0] + '\'';
        for (var i =1 ; i < favGenres.length; i++) {
            selectString += ' OR id = \'' + favGenres[i] + '\'';
        }
        db.raw('SELECT id FROM genres WHERE ' + selectString).rows(function (err, genreIDs) {
            if (!err) {
                if (genreIDs[0] != null) {
                    for (var i = 0; i < genreIDs.length; i++) {
                        genreIDs[i] = {username: username, genre_id: genreIDs[i]['id']};
                    }
                    db.insert('favourite_genres').values(genreIDs).returning('*').rows(function (err, rows) {
                        if (!err) {
                            if (rows[0] != null) {
                                callback({status: 200});
                            } else {
                                callback({status: 404, error: 'Failed to insert favourite genres'});
                            }
                        } else {
                            console.error(err);
                            callback({status: 500, error: 'Database error'});
                        }
                    });
                } else {
                    callback({status: 404, error: 'Genres not found'});
                }
            } else {
                console.error(err);
                callback({status: 500, error: 'Database error'});
            }
        });
    },

	postRatings: function (username, idList, ratings, callback) {
		if (!idList.join(' ').match(/[0-9]+/g)) {
			callback({status: 400, error: 'This method only takes movie IDs'});
		} else if (idList.length == ratings.length) {
			var insertString = 'INSERT INTO ratings(username, movie_id, rating) VALUES(\'' + username + '\', '
				+ idList[0] + ', ' + ratings[0] + ')';
			for (var i = 1; i < idList.length; i++) {
				insertString += ', (\'' + username + '\', ' + idList[i] + ', ' + ratings[i] + ')';
			}
			insertString += " RETURNING *;";
			db.raw(insertString).rows(function (err, rows) {
				if (!err) {
					if (rows[0] != null) {
						callback({status: 200});
					} else {
						callback({status: 404, error: 'Failed to add ratings'});
					}
				} else {
                    console.error(err);
					callback({status: 500, error: 'Database error'});
				}
			});
		} else {
			callback({status: 400, error: 'Number of ratings don\'t match number of IDs/titles'});
		}
	},

	getAverageRating: {

		byId: function (movieId, callback) {
			db.raw('SELECT AVG(rating) AS average, count(rating) AS total FROM ratings WHERE movie_id = $1',[movieId]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						row['average'] = parseFloat((+row['average']).toFixed(2));
						callback({status:200, averageRating: row})
					} else {
						callback({status:404, error: 'Failed to get average rating with movieId: ' + movieId})
					}
				} else {
					callback({status:500, error:'Database error'})
				}
			});
		},

		byTitle: function (movieTitle, callback) {
			db.raw('SELECT AVG(r.rating) AS average, count(r.rating) AS total FROM ratings r, movies m WHERE m.title = $1',[movieTitle]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						row['average'] = parseFloat((+row['average']).toFixed(2));
						callback({status:200, averageRating: row})
					} else {
						callback({status:404, error: 'Failed to get average rating with movieTitle: ' + movieTitle})
					}
				} else {
					callback({status:500, error:'Database error'})
				}
			});
		}
	},

	removeRating: {

		byId: function (username, movieId, callback) {
			db.raw('DELETE FROM ratings WHERE movie_id = $1 AND username = $2 RETURNING *', [movieId, username]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						callback({status: 200});
					} else {
						callback({status: 404, error: 'Could not find rating to delete'});
					}
				} else {
					callback({status: 500, error: 'Database error'});
				}
			});
		},

		byTitle: function (username, movieTitle, callback) {
			db.raw('DELETE FROM ratings WHERE movie_id = (SELECT id FROM movies WHERE title = $1) AND username = $2 RETURNING *', [movieTitle, username]).row(function (err, row) {
				if (!err) {
					if (row != null) {
						callback({status: 200});
					} else {
						callback({status: 404, error: 'Could not find rating to delete'})
					}
				} else {
					callback({status: 500, error: 'Database error'});
				}
			})
		}
	},

	getUserInfo: function(username, callback) {

		db.raw('SELECT U.firstname, U.lastname, U.username, U.datecreated, U.email FROM users U WHERE U.username = $1', [username]).row(function(err, row) {
			if(!err){
				if(row != null){
					callback({status: 200, userInfo: row});
				}else{
					callback({status: 404, error: 'Could not find user'})
				}
			}else{
				console.log(err);
				callback({status: 500, error: 'Database error'});
			}
		});

	}

};
