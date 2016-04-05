
module.exports = function(app) {

	var colors = require('colors');

	var session = require('../lib/session.js');

	app.post('/login', function(req, res) {
		console.log(req.body);
		if(req.body.username != null && req.body.password != null) {
			session.login(req.body.username, req.body.password, function(status) {

				if(status['status'] == 200) {
					req.session.ssid = status['ssid'];
					req.session.username = status['username'];
					req.session.userId = status['userId'];
					res.json(status);
				}else{
					res.json(status);
				}

			});
		}else{
			res.json({status: 400, reason: 'Improper parameters'});
		}
	});

	app.get('/session', function(req, res) {
		if(req.session && req.session.ssid != null && req.session.username != null) {
			session.checkSession(req.session.username, req.session.ssid, function(status) {
				res.json(status);
			});
		}else{
			res.json({status: 400, reason: 'Improper parameters'});
		}
	});

}
