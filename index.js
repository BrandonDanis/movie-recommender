var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');
var request = require('request');

var app = express();

app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());

var movieURL = 'http://api.themoviedb.org';
var apiKey = 'ff0f435fed2525ddcffd5b5a4af3fcd3';

app.get('/', function(req,res) {
	request('https://api.themoviedb.org/3/movie/550?api_key=ff0f435fed2525ddcffd5b5a4af3fcd3', function(err,response,body) {
		console.log(body);
	});
});


var movieDB = require('moviedb')(apiKey);

app.get('/popular-movies', function(req,res) {
	movieDB.miscPopularMovies(function(err,res) {

		var movies = res.results;
		for(var i=0;i<movies.length;i++){
			console.log(movies[i]['title']);
		}

	});
});

app.listen(process.env.PORT || 8080);

console.log("#################################".green);
console.log("App is now listening on port 8080".green);
console.log("#################################".green);
