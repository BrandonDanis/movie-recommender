/**
 * Created by silver_android on 05/03/16.
 */

var api = new Api();

loadMovie = function (idTitle) {

    var url = window.location.href;

    var movieTitle = window.url("?title",url);
    var movieId = window.url("?id",url);

    if(movieTitle != null){
        api.getSpecificMovieByTitle(movieTitle, function (res) {
            processData("movie",res);
        });
    }else if(movieId != null){
        api.getSpecificMovieById(movieId, function (res) {
            processData("movie",res);
        });
    }else{
        //add failsafe for no parameters provided
    }

};

processData = function(type,data) {

    if(data['status'] != 200)
        console.log('Error loading movie: ' + data);

    switch (type) {
        case "movie":
            setupMovieInfo(data['movie']);
            break;
        default:
            console.log('Not a case');
    }

}

//poster,title,release_date,overview,genres,director name
//replace('~MOVIERELEASEYEAR~', movie.release_date.split('-')[0])

setupMovieInfo = function(movie) {

    $('title').html(movie['title']);

    var imgSTR = '<img src="https://image.tmdb.org/t/p/w185/~IMGURL~" width="185" height="278">';
    imgSTR = imgSTR.replace('~IMGURL~',movie['poster']);
    $('.imageContainer').append(imgSTR);

};

$(document).on('click', '.star', function() {
    var rating = 5 - ($(this).index());

    if (getParameterByName('id') != null) {
        api.rate(getParameterByName('id'), rating, function (result) {
            setRating(result['rating']);
        });
    } else if (getParameterByName('title') != null) {
        api.rate(getParameterByName('title'), rating, function (result) {
            setRating(result['rating']);
        });
    } else {
        console.log('Bad parameters');
    }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setRating(rating) {
    for (var i = 1; i <= 5; i++) {
        var id = '#' + i;
        if (i <= rating) {
            $(id).removeClass('fa-star-o').addClass('fa-star').css('color', 'gold');
        } else {
            $(id).removeClass('fa-star').addClass('fa-star-o').css('color', '');
        }
    }
}
