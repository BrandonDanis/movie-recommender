var api = new Api();

self.movieArray;
self.loaded = 0;
self.increment = 100;

setupPage = function() {

    console.log(location.hash);

    var url = window.location.href;

    var path = window.url('path');

    var genre = window.url("?name",url);

    if(path == '/genres'){
        if(genre){
            loadSpecificGenre(genre);
        }else{
            loadGenres();
        }

    }else if(path == '/movies'){

        $(".sortingContainer").css("display","block");

        var hash = location.hash;
        if(hash == '#A-Z'){
            loadMoviesFromAZ();
        }else if(hash == '#Z-A'){
            loadMoviesFromZA();
        }else if(hash == '#Recent'){
            loadMoviesByRelease();
        }else{
            loadMovies();
        }
    }else {
        $('#movieContainer').append('<h1>MAIN PAGE</h1>');
    }

}

logout = function () {
    api.logout();
};

loadMovies = function () {

    api.getAllMovies(function (res) {

        var moviesArray = res['movies'];
        self.movieArray = res['movies'];

        if (res['status'] == 200) {

            $('#movieContainer').empty();

            for (var i = self.loaded; i < self.loaded+self.increment; i++) {
                $('#movieContainer').append(generateMovieDiv(moviesArray[i]['id'], moviesArray[i]['title'], moviesArray[i]['poster']));
            }

        } else {
            console.log('Error getting movies');
        }

    });

};

loadMoviesFromAZ = function() {

    location.hash = "A-Z"

    api.getAllMovieFromAZ(function(res) {

        var moviesArray = res['movies'];
        self.movieArray = res['movies'];

        if (res['status'] == 200) {

            $('#movieContainer').empty();

            for (var i = 0; i < self.loaded+self.increment; i++) {
                $('#movieContainer').append(generateMovieDiv(moviesArray[i]['id'], moviesArray[i]['title'], moviesArray[i]['poster']));
            }

        } else {
            console.log('Error getting movies');
        }

    });

};

loadMoviesFromZA = function() {

    location.hash = "Z-A";

    api.getAllMovieFromZA(function(res) {

        var moviesArray = res['movies'];
        self.movieArray = res['movies'];

        if (res['status'] == 200) {

            $('#movieContainer').empty();

            for (var i = 0; i < self.loaded+self.increment; i++) {
                $('#movieContainer').append(generateMovieDiv(moviesArray[i]['id'], moviesArray[i]['title'], moviesArray[i]['poster']));
            }

        } else {
            console.log('Error getting movies');
        }

    });

};

loadMoviesByRelease = function() {

    location.hash = "Recent";

    api.getAllMovieByRelease(function(res) {

        var moviesArray = res['movies'];
        self.movieArray = res['movies'];

        if (res['status'] == 200) {

            $('#movieContainer').empty();

            for (var i = 0; i < self.loaded+self.increment; i++) {
                $('#movieContainer').append(generateMovieDiv(moviesArray[i]['id'], moviesArray[i]['title'], moviesArray[i]['poster']));
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

loadGenres = function() {

    api.getAllGenres(function(res) {

        api.getMostPopularByGenre(function(popMoviesRes) {

            var popMovies = popMoviesRes['movies'];
            console.log(popMovies);
            if(res['status'] == 200){

                for(var i=0; i< res['genres'].length; i++){
                    $('#movieContainer').append(generateGenres(res['genres'][i]['name'],findMovie(popMovies,res['genres'][i]['name'])));
                }

            }else{
                //error loading posts.
            }

        });

    });

}

findMovie = function(array, genre){
    for(var i=0; i<array.length; i++){
        if(array[i] != null){
            if(array[i]['name'] == genre){
                return array[i]['poster'];
            }
        }
    }
    return 'fail';
}

generateGenres = function(genreName, imageUrl) {

    var imageTemplate = '<img src="https://image.tmdb.org/t/p/w185~IMGURL~" width="185" height="278"/>';
    var divTemplate = imageUrl == 'fail' ? '':'<div class="movieBox"><a href="./genres?name=~GENRENAME~"><div class="imageContainer">~IMGTEMPLATE~</div><div class="movieInfo"><h4>~GENRENAME~</h4></div></a></div>';

    divTemplate = divTemplate.replace(/~IMGTEMPLATE~/g, imageTemplate);
    divTemplate = divTemplate.replace(/~IMGURL~/g, imageUrl);
    divTemplate = divTemplate.replace(/~GENRENAME~/g, genreName);

    return divTemplate;
}

loadSpecificGenre = function(genreName) {

    var header = '<div class="row"><div class="col-md-12"><h1>~GENRENAME~</h1></div></div>'
    header = header.replace(/~GENRENAME~/g,genreName);
    $('#movieContainer').append(header);

    api.getMovieByGenreName(genreName, function(res) {

        console.log(res);

        var moviesArray = res['movies'];
        self.movieArray = res['movies'];

        if (res['status'] == 200) {

            for (var i = 0; i < self.loaded+self.increment; i++) {
                $('#movieContainer').append(generateMovieDiv(moviesArray[i]['id'], moviesArray[i]['title'], moviesArray[i]['poster']));
            }

        } else {
            console.log('Error getting movies');
        }

    });

}

loadMoreMovies = function(){



}
