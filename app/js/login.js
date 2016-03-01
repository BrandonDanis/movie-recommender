var api = new LoginApi();

var initLogin = function(){
	var user = $('#login-username').val();
	var pssd = $('#login-password').val();

	api.login(user, pssd, function(status) {

		if(status['status'] == 200){
			 swal("Success!", "You have logged in", "success");

			 setTimeout(function(){
				 location.reload();
			 }, 1000);

		}else{

			$(".alert").css("display", "inherit");

			setTimeout(function(){
				$(".alert").css("display", "none");
			}, 4000);
		}

	});
}
