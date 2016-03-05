
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

	this.getSpecificMovie = function (idTitle, callback) {
		$.get(apiUrl + '/specific-movie/' + idTitle, {}, function (res) {
			callback(res);
		});
	};

}
