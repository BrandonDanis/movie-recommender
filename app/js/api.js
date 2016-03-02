
function Api()
{

	var apiUrl = 'http://localhost:8080';

	this.logout = function() {
		$.get(apiUrl + '/logout', {}, function(res){
			location.reload();
		});
	}

}
