var api = new Api();

setupPage = function() {

	loadPopularPosts();

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

generateMovieDiv = function (movieId, movieTitle, posterUrl) {

    var divTemplate = '<div class="movieBox"><a href="./movie?id=~MOVIEID~"><div class="imageContainer"><img src="https://image.tmdb.org/t/p/w185~IMGURL~" width="185" height="278"/></div><div class="movieInfo"><h4>~MOVIETITLE~</h4></div></a></div>';

    divTemplate = divTemplate.replace(/~IMGURL~/g, posterUrl);
    divTemplate = divTemplate.replace(/~MOVIETITLE~/g, movieTitle);
    divTemplate = divTemplate.replace(/~MOVIEID~/g, movieId);

    return divTemplate;

};
