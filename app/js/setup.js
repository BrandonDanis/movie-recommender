

var api = new Api();

self.favGenres = [];

var info = {
	name: "",
	lastname: "",
	favGenres: [],
	favMovies: []
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

	self.favGenres = [];

	$('input', $('#question3Div')).each(function () {
    	if($(this).is(':checked')){
			self.favGenres.push(parseInt($(this).attr('id')))
		}
	});

	if(self.favGenres.length < 3){
		//not enough genres
		console.log("Please select more than 3 genres.");
	}else{
		setupStep4();
		info['favGenres'] = self.favGenres;
 	}

}

var setupStep4 = function() {

	$("#question3Div").fadeOut("1s",function(){

		$("#question4Div").css("display","block");

		api.getPopularMultiGenre(self.favGenres, function (result) {

			var moviesArray = result['movies'];

			if (result['status'] == 200 || (result['status'] == 404 && result['movies'].length > 0)) {

	            $(".popularMovies").empty();

				for(var i = 0; i < moviesArray.length; i++){
					var temp = '<p><input type="checkbox" id="~ID~"/><label for="~ID~">~MOVIE~</label></p>';
					temp = temp.replace(/~ID~/g,moviesArray[i]['id'])
					temp = temp.replace(/~MOVIE~/g,moviesArray[i]['title'])
					$(".popularMovies").append(temp);
				}

	        } else {
	            console.log('Error getting movies');
	        }


		});

	});

}

var finish = function() {

	var favMovies = []

	$('input', $('#question4Div')).each(function () {
    	if($(this).is(':checked')){
			favMovies.push(parseInt($(this).attr('id')))
		}
	});

	if(favMovies.length < 1){
		//not enough genres
		console.log("Please select more atleast 1 movie.");
	}else{
		info['favMovies'] = favMovies;

		api.setup(info['name'], info['lastname'], info['favGenres'], info['favMovies'], function(res) {
			if(res['status'] == 200){
				location.reload();
			}else{
				console.log("oops");
			}
		});

 	}

}

var revertToQuestion = function(from, to) {

	var divToRemove = '#question' + from + 'Div';
	var divToShow = '#question' + to + 'Div';

	$(divToRemove).fadeOut("1s",function(){
		$(divToShow).css("display","block")
	});

}
