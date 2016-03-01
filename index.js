var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var request = require('request');

var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req, res) {
	res.json("Hello World!");
});

//session
require('./routes/movies-route.js')(app);
require('./routes/directors-route.js')(app);

//404 catch
app.use(function(req, res)
{
	res.status(404).json({status: 404, reason: "Route not found", session: req.session});
});

app.listen(process.env.PORT || 8080);

console.log("#################################".green);
console.log("App is now listening on port 8080".green);
console.log("#################################".green);
