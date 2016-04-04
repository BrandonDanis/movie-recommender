var api = new LoginApi();

var initLogin = function(){
	var user = $('#').val();
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

var initSignup = function(){

	var flag = '<div class="alert alert-~TYPE~" style="display:none;" role="alert"><strong>oops!</strong>~STATUS~</div>';

	var user = $('#register-username').val();
	var pssd = $('#register-password').val();
	var confirmPssd = $('#register-confirm-password').val();
	var email = $('#register-email').val();

	api.register(user, pssd, confirmPssd, email, function(status) {

		if(status['status'] == 200){
			flag = flag.replace('~STATUS~', "Account Created. Please Login!");
			flag = flag.replace('~TYPE~', "success");
			$(".flagBox").append(flag);

			setTimeout(function(){
				location.reload();
			}, 1000);
		}else{
			flag = flag.replace('~STATUS~', status['error']);
			flag = flag.replace('~TYPE~', "danger");
			$(".flagBox").append(flag);

			setTimeout(function(){
				$(".flagBox").empty();
			}, 2000);

		}

	});

}

var displayRegister = function(){
	$(".login-content").css("display","none");
	$(".register-content").css("display","block");
}

var displayLogin = function(){
	$(".register-content").css("display","none");
	$(".login-content").css("display","block");
}
