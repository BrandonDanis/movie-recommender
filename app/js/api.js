
function Api()
{

	var apiUrl = 'http://localhost:8080';

	this.logout = function() {
		$.get(apiUrl + '/logout', {}, function(res){
			location.reload();
		});
	};

	this.getAllMovies = function(callback) {
		$.get(apiUrl + '/movies', {}, function(res){
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

}
