
// Establish db connection
//var dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL + '?ssl=true' : '/var/run/postgresql/';
var dbUrl = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure( dbUrl );

var bcrypt = require('bcrypt');

module.exports = {

	add: function(username, password, callback){

		var salt = bcrypt.genSaltSync(8);
		var hashedPass = bcrypt.hashSync(password, salt);

		var userToAdd = {
			username: username,
			password: hashedPass
		}

		db.insert('users', userToAdd).returning('*').rows(function(err, rows){
			if(!err){
				if(rows[0] != null){
					console.log('User succesfully created!'.green);
					callback({status: 200, user: rows[0]})
				}else{
					callback({status: 404});
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

	}

}
