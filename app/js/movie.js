/**
 * Created by silver_android on 05/03/16.
 */

var api = new Api();

self.movieTitle;
self.movieId;

loadMovie = function (idTitle) {

    var url = window.location.href;

    self.movieTitle = window.url("?title",url);
    self.movieId = window.url("?id",url);

    if(self.movieTitle != null){
        api.getSpecificMovieByTitle(self.movieTitle, function(res) {
            processData("movie",res);
        });
        api.getRatingByTitle(self.movieTitle, function(res) {
            processData("rating",res);
        });
        api.getCastsByTitle(self.movieTitle, function(res) {
            processData("casts",res);
        });
        //get director
    }else if(self.movieId != null){
        api.getSpecificMovieById(self.movieId, function(res) {
            processData("movie",res);
        });
        api.getRatingById(self.movieId, function(res) {
            processData("rating",res);
        });
        api.getDirectorByMovieId(self.movieId, function(res) {
            processData("director",res);
        });
        api.getCastsById(self.movieId, function(res) {
            processData("casts",res);
        });
    }else{
        //add failsafe for no parameters provided
    }

};

processData = function(type,data) {

    if(data['status'] != 200){
        console.log('Error loading: ' + type);
        return;
    }

    switch (type) {
        case "movie":
            setupMovieInfo(data['movie']);
            break;
        case "rating":
            setRatingStars(data['rating']['rating']);
            break;
        case "director":
            setupDirectorInfo(data);
            break;
        case "casts":
            setupCastsInfo(data['casts']);
            break;
        default:
            console.log('Not a case');
    }

}

setupMovieInfo = function(movie) {

    //HTML Page Title
    $('title').html(movie['title']);

    //Movie Poster
    var imgSTR = '<img src="https://image.tmdb.org/t/p/w185/~IMGURL~" width="185" height="278">';
    imgSTR = imgSTR.replace('~IMGURL~',movie['poster']);
    $('.imageContainer').append(imgSTR);

    //Movie Title
    var movieTitleSTR = '<h1>~MOVIETITLE~ (~DATE~)</h1>';
    movieTitleSTR = movieTitleSTR.replace('~MOVIETITLE~',movie['title']);
    movieTitleSTR = movieTitleSTR.replace('~DATE~',movie['release_date'].split('-')[0]);
    $('.movieTitleContainer').append(movieTitleSTR);

    //Movie genres
    var genresSTR = '<h3><strong>Genres:</strong> ~ALLGENRES~</h3>';
    var singleGenreSTR = '<a href="/genres?name=~GENRE~">~GENRE~</a>';
    var allGenreSTR = '';
    for(var i=0;i<movie['genres'].length;i++){
        var item = singleGenreSTR;
        if(i != 0)
            allGenreSTR = allGenreSTR + (', ');
        item = item.replace(/~GENRE~/g,movie['genres'][i]);
        allGenreSTR = allGenreSTR + item;
    }
    genresSTR = genresSTR.replace('~ALLGENRES~',allGenreSTR);
    $('.genresContainer').append(genresSTR);

    //Movie overview
    var overviewSTR = '<p>~TEXT~</p>';
    overviewSTR = overviewSTR.replace('~TEXT~',movie['overview']);
    $('.overviewContainer').append(overviewSTR);

};

setupCastsInfo = function(casts) {

    var castTitle = '<h1>Casts: </h1>';
    $('.castsContainer').append(castTitle);

    var castTemplate = '<p><strong>~CHAR~</strong> played by <strong>~ACTORNAME~</strong></p>';

    for(var i=0; i<casts.length; i++) {

        var castTemp = castTemplate;
        castTemp = castTemp.replace('~CHAR~',casts[i]['character']);
        castTemp = castTemp.replace('~ACTORNAME~',casts[i]['name']);

        $('.castsContainer').append(castTemp);



    }

};

setupDirectorInfo = function(director) {

    //Director name
    var directorSTR = '<h3><strong>Directed by:</strong> <a href="/director?name=~DIRNAME~">~DIRNAME~</a></h3>';
    directorSTR = directorSTR.replace(/~DIRNAME~/g,director['director']['name']);
    $('.directorContainer').append(directorSTR);

};

$(document).on('click', '.star', function() {
    var rating = 5 - ($(this).index());

    if (self.movieId != null) {
        api.rate(self.movieId, rating, function (result) {
            setRatingStars(result['rating']);
        });
    } else if (self.movieTitle != null) {
        api.rate(self.movieTitle, rating, function (result) {
            setRatingStars(result['rating']);
        });
    } else {
        console.log('Bad parameters');
    }
});

setRating = function(rating) {
    var template = '<h1>( ~AVG~ out of ~COUNT~ votes )</h1>';
    template = template.replace(/~AVG~/g,rating[''])

}

setRatingStars = function(rating) {

    for (var i = 1; i <= 5; i++) {
        var id = '#' + i;
        if (i <= rating) {
            $(id).removeClass('fa-star-o').addClass('fa-star').css('color', 'gold');
        } else {
            $(id).removeClass('fa-star').addClass('fa-star-o').css('color', '');
        }
    }

}
