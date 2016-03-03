// Establish db connection
//var dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL + '?ssl=true' : '/var/run/postgresql/';
var dbUrl = process.env.DATABASE_URL;
//var dbUrl = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure( dbUrl );

var bcrypt = require('bcrypt');

var rndString = require("randomstring");

module.exports = {

	login: function(username, password, callback) {

		db.select().from('users').where('username', username).rows(function(err, rows){

			if(!err){
				if(rows[0] != null){

					var hashedPass = rows[0]['password'];
					var validPassword = bcrypt.compareSync(password,hashedPass);

					if(validPassword){

						var newSSID = rndString.generate(20);

						db.update('users', {ssid: newSSID}).where('username', username).returning('*').rows(function(err,rows){
							if(!err){
								if(rows[0] != null){
									callback({status: 200, username: username, ssid: newSSID, userId: rows[0]['id']});
								}else{
									callback({status: 404});
								}
							}else{
								callback({status: 500, status: 'Database error'});
							}
						});

					}else{
						callback({status: 400, reason: 'Incorrect password or username'});
					}

				}else{
					callback({status: 400, reason: 'User not found'});
				}
			}else{
				console.error(err);
				callback({status: 400, reason: 'Error'});
			}

		});

	},

	checkSession: function(username, sessionID, callback) {

		db.select().from('users').where('username', username).rows(function(err, rows) {

			if(!err){
				if(rows[0] != null){

					if(rows[0]['ssid'] == sessionID){
						callback({status: 200, reason: 'Session is valid'});
					}else{
						callback({status: 400, reason: 'Session is not valid'});
					}

				}else{
					callback({status: 400, reason: 'User not found'});
				}
			}else{
				console.log(err);
				callback({status: 400, reason: err});
			}


		});

	}

}
