
function Api()
{

	var apiUrl = 'http://localhost:8080';

	this.logout = function() {
		$.get(apiUrl + '/logout', {}, function(res){
			location.reload();
		});
	};

	this.getAllMovies = function(callback) {
		$.get(apiUrl + '/all-movies', {}, function(res){
			callback(res);
		});
	};

	this.getAllMovieFromAZ = function(callback) {
		$.get(apiUrl + '/moviesFromA-Z', {}, function(res) {
			callback(res);
		});
	};

	this.getAllMovieFromZA = function(callback) {
		$.get(apiUrl + '/moviesFromZ-A', {}, function(res) {
			callback(res);
		});
	};

	this.getAllMovieByRelease = function(callback) {
		$.get(apiUrl + '/moviesByRelease', {}, function(res) {
			callback(res);
		});
	};

	this.getSpecificMovieById = function (idTitle, callback) {
		$.get(apiUrl + '/specific-movie', {id: idTitle}, function(res) {
			callback(res);
		});
	};

	this.getSpecificMovieByTitle = function (titleString, callback) {
		$.get(apiUrl + '/specific-movie', {title: titleString}, function(res) {
			callback(res);
		});
	};

	this.rate = function (movieIDTitle, rating, callback) {
		$.post(apiUrl + '/rating', {movieId: movieIDTitle, rating: rating}, function(res) {
			callback(res);
		});
	}

	this.getRatingById = function(movieId, callback) {
		$.get(apiUrl + '/rating', {movieId: movieId}, function(res) {
			callback(res);
		});
	}

	this.getRatingByTitle = function(movieIDTitle, callback) {
		$.get(apiUrl + '/rating', {movieTitle: movieIDTitle}, function(res) {
			callback(res);
		});
	}

	this.removeRatingById = function (movieId, callback) {
		$.ajax({
			url: apiUrl + '/rating',
			type: 'DELETE',
			data: {movieId: movieId},
			success: function (res) {
				callback(res);
			}
		})
	}

	this.removeRatingByTitle = function (movieTitle, callback) {
		$.ajax({
			url: apiUrl + '/rating',
			type: 'DELETE',
			data: {movieTitle: movieTitle},
			success: function (res) {
				callback(res);
			}
		})
	}

	this.getDirectorByMovieId = function(movieId, callback) {
		$.get(apiUrl + '/director', {movieId: movieId}, function(res) {
			callback(res);
		});
	}

	this.getCastsById = function(movieId, callback) {
		$.get(apiUrl + '/casts', {movieId: movieId}, function(res) {
			callback(res);
		});
	}

	this.getAllGenres = function(callback) {
		$.get(apiUrl + '/all-genres', {}, function(res) {
			callback(res);
		});
	}

	this.getMostPopularByGenre = function(callback) {
		$.get(apiUrl + '/getMostPopularByGenre', {}, function(res) {
			callback(res);
		});
	}

	this.getMovieByGenreName = function(name, callback) {
		$.get(apiUrl + '/getMoviesFromGenre', {genreName: name}, function(res) {
			callback(res);
		});
	}
	
	this.getTrailerById = function (id, callback) {
		$.get(apiUrl + '/trailer', {id: id}, function (res) {
			callback(res);
		});
	};

	this.getTrailerByTitle = function (title, callback) {
		$.get(apiUrl + '/trailer', {title: title}, function (res) {
			callback(res);
		});
	};
}
