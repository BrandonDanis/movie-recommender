var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var request = require('request');

var cookieSession = require('client-sessions');
var cookieParser = require('cookie-parser');

var path = require('path');

var app = express();

app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(cors());

app.use(cookieSession({
	cookieName: 'session',
	secret: 'keyboard_cat',
	duration: 1000 * 60 * 60 * 24 * 7, //one week session
	activeDuration: 1000 * 60 * 60 * 24, //interation extends session by one day
	httpOnly: true,
	secure: true,
	ephemeral: true
}));

var session = require('./lib/session.js');

app.get('/', function(req, res) {
	if(req.session && req.session.ssid != null && req.session.username != null) {
		session.checkSession(req.session.username, req.session.ssid, function(status) {
			if(status['status'] = 200){
				res.sendFile(path.join(__dirname + '/app/index.html'));
			}else{
				res.sendFile(path.join(__dirname + '/app/login.html'));
			}
		});
	}else{
		res.sendFile(path.join(__dirname + '/app/login.html'));
	}
});

app.get('/movie', function(req, res) {
	if(req.session && req.session.ssid != null && req.session.username != null) {
		session.checkSession(req.session.username, req.session.ssid, function(status) {
			if(status['status'] = 200){
				res.sendFile(path.join(__dirname + '/app/movie.html'));
			}else{
				res.sendFile(path.join(__dirname + '/app/login.html'));
			}
		});
	}else{
		res.sendFile(path.join(__dirname + '/app/login.html'));
	}
});

app.use(express.static(path.join(__dirname, 'app')));

//movies
require('./routes/movies-route.js')(app);

//director
require('./routes/directors-route.js')(app);

//session
require('./routes/session-route.js')(app);

//users
require('./routes/users-route.js')(app);

//search
require('./routes/search-route.js')(app);

//logout
app.get('/logout', function(req, res)
{
    req.session.reset();
	req.session.ssid == 0;
    res.redirect('/');
});

//404 catch
app.use(function(req, res)
{
	res.status(404).json({status: 404, reason: "Route not found", session: req.session});
});

app.listen(process.env.PORT || 8080);

console.log("#################################".green);
console.log("App is now listening on port 8080".green);
console.log("#################################".green);
