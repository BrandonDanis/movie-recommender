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

var genresDict = {
	28: "Action",
	12: "Adventure",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	14: "Fantasy",
	10769: "Foreign",
	36: "History",
	27: "Horror",
	10402: "Music",
	9648: "Mystery",
	10749: "Romance",
	878: "Science Fiction",
	10770: "TV Movie",
	53: "Thriller",
	10752: "War",
	37: "Western",
};


for(var i=0;i<10;i++)
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
				var genresArray = moviesArray[i]['genre_ids'];
				var movieID = rows[0].id;

				for(var k=0;k<genresArray.length;k++)
				{
					db.select().from('genres').where('name', genresDict[genresArray[k]]).rows(function(err,genreRows){
						if(!err){

							var genre_movie = {
								movie_id: movieID,
								genre_id: genreRows[0]['id'],
							};

							db.insert('movies_genres', genre_movie).returning('*').rows(function(err,rows){
								if(!err){
									console.log("Movie-Genre relationship created".green);
								}else{
									console.log("Error: Can't add movie_genre relation".red);
								}
							});

						}else{
							console.log("Error: Can't find genre".red);
						}
					});
				}

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
