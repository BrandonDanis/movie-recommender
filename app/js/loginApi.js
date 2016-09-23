
function LoginApi() {

	var apiUrl = process.env.API_URL || 'http://localhost:8080';
	//var apiUrl = 'https://brandon-todo.herokuapp.com';
	//var apiUrl = 'http://159.203.28.249:8080';

	this.login = function(user, pssd, callback)
	{
		$.post(apiUrl + '/login', {username: user, password: pssd}, function(res) {
			callback(res);
		});
	};

	this.register = function(user, pssd, confirmPssd, email, callback) {
		$.post(apiUrl + '/users', {username: user, password: pssd, confirmPassword: confirmPssd, email: email}, function(res) {
			callback(res);
		});
	};



}
