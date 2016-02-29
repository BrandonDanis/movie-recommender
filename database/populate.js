var fs = require('fs');
var colors = require('colors');

// var dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL + '?ssl=true' : '/var/run/postgresql/';
var dbUrl = 'postgres://localhost:5432/Netflix2';
var db = require('pg-bricks').configure( dbUrl );

var MOVIES_FILENAME = 'movies.json';
var contentJSON = fs.readFileSync(MOVIES_FILENAME);
var moviesArray = JSON.parse(contentJSON);

var GENRES_FILENAME = 'genres.json';
var genresJSON = fs.readFileSync(GENRES_FILENAME);
var genresArray = JSON.parse(genresJSON);



for(var i=0;i<moviesArray.length;i++)
{
	var movieToAdd = {
		overview: moviesArray[i]['overview'],
		release_date: moviesArray[i]['release_date'],
		runtime: 10,
		poster: moviesArray[i]['poster'],
		rating: 0,
		moviedb_id: moviesArray[i]['id'],
		title: moviesArray[i]['title']
	};

	db.insert('movies', movieToAdd).returning('*').rows(function(err,rows){
		if(!err){
			if(rows[0] != null){
				console.log(('Movie added | id: '+rows[0].id).green);

				//relation table
				//var genres = moviesArray[i]['genre_ids'];

			}else{
				console.log('404: Uh-Oh'.red);
			}
		}else{
			if(err['code'] == 23505){
				console.log('Movie already in databse'.yellow);
			}
		}
	});

}


//SCHEMA
// CREATE TABLE movies (
//   id serial,
//   overview text NOT NULL,
//   release_date varchar(255) NOT NULL,
//   runtime integer NOT NULL,
//   poster varchar(255) NOT NULL,
//   rating integer,
//   moviedbID integer NOT NULL,
//   title text NOT NULL,
//   PRIMARY KEY(id)
// );
