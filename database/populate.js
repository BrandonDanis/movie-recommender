var fs = require('fs');

var dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL + '?ssl=true' : '/var/run/postgresql/';
var db = require('pg-bricks').configure( dbUrl );

var FILENAME = 'movies.json';
var contentJSON = fs.readFileSync(FILENAME);

var moviesArray = JSON.parse(contentJSON);

console.log(moviesArray.length);
