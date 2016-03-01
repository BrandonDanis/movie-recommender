
function LoginApi() {

	var apiUrl = 'http://localhost:8080';
	//var apiUrl = 'https://brandon-todo.herokuapp.com';
	//var apiUrl = 'http://159.203.28.249:8080';

	this.login = function(user, pssd, callback)
	{
		$.post(apiUrl + '/login', {username: user, password: pssd}, function(res) {
			callback(res);
		});
	}

}
