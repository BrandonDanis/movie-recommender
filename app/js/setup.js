

var api = new Api();

var info = {
	name: "",
	lastname: "",
	favGenres: {},
	favMovies: {}
}

var initPage = function(){
	api.getAllGenres(function(res) {
		if(res['status'] == 200){

			for(i=0; i<res['genres'].length; i++){
				var temp = '<p><input type="checkbox" id="~ID~"/><label for="~ID~">~GENRE~</label></p>';
				temp = temp.replace(/~ID~/g,res['genres'][i]['id'])
				temp = temp.replace(/~GENRE~/g,res['genres'][i]['name'])
				$(".genresForm").append(temp);
			}

		}
	});
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

var setupStep3 = function(){

	$("#question2Div").fadeOut("1s",function(){

		$("#question3Div").css("display","block")

	});

}

var question3Submit = function(){

	var genreIds = []

	$('input', $('#question3Div')).each(function () {
    	if($(this).is(':checked')){
			genreIds.push(parseInt($(this).attr('id')))
		}
	});

	console.log(genreIds);

}

var revertToQuestion = function(from, to) {

	var divToRemove = '#question' + from + 'Div';
	var divToShow = '#question' + to + 'Div';

	$(divToRemove).fadeOut("1s",function(){
		$(divToShow).css("display","block")
	});

}
