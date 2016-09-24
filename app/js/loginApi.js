
function LoginApi() {

	var apiUrl = 'http://localhost:80';

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
