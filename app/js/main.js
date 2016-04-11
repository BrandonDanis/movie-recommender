var api = new Api();

setupPage = function() {

	loadPopularPosts();

	loadRecommendedMovies();

	loadUserInfo();

}

loadUserInfo = function() {

	var infoTitle = '<h1>Welcome, ~USERNAME~</h1>';
	var infoName = '<div class="info"><h1>Full name: </h1><h3>~FIRST~, </h3><h3>~LAST~</h3></div>';
	var infoEmail = '<div class="info"><h1>Email: </h1><h3>~EMAIL~</h3></div>';
	var infoDate = '<div class="info"><h1>Member since: </h1><h3>~DATE~</h3></div>';

	api.getUserInfo(function(res) {

		var info = res['userInfo']

		if(info['username'] != null){
			infoTitle = infoTitle.replace(/~USERNAME~/g,info['username']);
			$('.userInfo').append(infoTitle);
		}

		if(info['firstname'] != null && info['lastname'] != null){
			infoName = infoName.replace(/~FIRST~/g,info['firstname']);
			infoName = infoName.replace(/~LAST~/g,info['lastname']);
			$('.userInfo').append(infoName);
		}

		if(info['username'] != null){
			infoEmail = infoEmail.replace(/~EMAIL~/g,info['email']);
			$('.userInfo').append(infoEmail);
		}

		if(info['username'] != null){
			infoDate = infoDate.replace(/~DATE~/g,info['datecreated']);
			$('.userInfo').append(infoDate);
		}

	});

}

loadPopularPosts = function() {

	api.getAllMovies(function (res) {

		var moviesArray = res['movies'];

		if (res['status'] == 200) {

            $(".popularMovies").empty();

            for (var i = 0; i < 20; i++) {
                $(".popularMovies").append(generateMovieDiv(moviesArray[i]['id'], moviesArray[i]['title'], moviesArray[i]['poster']));
            }

        } else {
            console.log('Error getting movies');
        }

	});

};

loadRecommendedMovies = function() {

	api.getRecommendedMovies(function (res) {

		var moviesArray = res['movies'];

		if (res['status'] == 200) {

            $(".recommendedMovies").empty();

            for (var i = 0; i < 20; i++) {
                $(".recommendedMovies").append(generateMovieDiv(moviesArray[i]['id'], moviesArray[i]['title'], moviesArray[i]['poster']));
            }

        } else {
            console.log('Error getting movies');
        }

	});

};

generateMovieDiv = function (movieId, movieTitle, posterUrl) {

    var divTemplate = '<div class="movieBox"><a href="./movie?id=~MOVIEID~"><div class="imageContainer"><img src="https://image.tmdb.org/t/p/w185~IMGURL~" width="185" height="278"/></div><div class="movieInfo"><h4>~MOVIETITLE~</h4></div></a></div>';

    divTemplate = divTemplate.replace(/~IMGURL~/g, posterUrl);
    divTemplate = divTemplate.replace(/~MOVIETITLE~/g, movieTitle);
    divTemplate = divTemplate.replace(/~MOVIEID~/g, movieId);

    return divTemplate;

};
