

var info = {
	name: "",
	lastname: "",
	favGenres: {},
	favMovies: {}
}

var question1Submit = function() {

	var name = $("#question1Input").val()

	if(name.length > 0 && name.length < 26){
		info['name'] = name;
		setupStep2();
	}

}

var setupStep2 = function(){

	$("#question1Div").fadeOut("1s",function(){

		$("#question2Div").css("display","block")

	});

}

var question2Submit = function(){

	var lastName = $("#question2Input").val()

	if(lastName.length > 0 && lastName.length < 26){
		info['lastname'] = lastName;
		setupStep3();
	}

}

var revertToQuestion = function(from, to) {

	var divToRemove = '#question' + from + 'Div';
	var divToShow = '#question' + to + 'Div';

	$(divToRemove).fadeOut("1s",function(){
		$(divToShow).css("display","block")
	});

}
