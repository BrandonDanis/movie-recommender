/**
 * Created by silver_android on 05/03/16.
 */

var api = new Api();

loadMovie = function (idTitle) {
<<<<<<< HEAD

    var url = window.location.href;

    var movieTitle = window.url("?title",url);
    var movieId = window.url("?id",url);

    if(movieTitle != null){
        api.getSpecificMovieByTitle(movieTitle, function (res) {
            if (res['status'] == 200) {
                $('.container-fluid').append(generateMovie(res['movie']));
                $('title').html(res['movie']['title']);
            } else {
                console.log(res);
                console.log('Error loading movie');
            }
        });
    }else if(movieId != null){
        api.getSpecificMovieById(movieId, function (res) {
            if (res['status'] == 200) {
                $('.container-fluid').append(generateMovie(res['movie']));
                $('title').html(res['movie']['title']);
            } else {
                console.log(res);
                console.log('Error loading movie');
            }
        });
    }else{
        //add failsafe for no parameters provided
    }

=======
    api.getSpecificMovie(idTitle, function (res) {
        if (res['status'] == 200) {
            $('.container-fluid').append(generateMovie(res['movie']));
            $('title').html(res['movie']['title']);
            setRating(res['movie']['rating']);
        } else {
            console.log(res);
            console.log('Error loading movie');
        }
    });
>>>>>>> c960e38ce46e126ccc277bda425475b66af1cfa9
};

generateMovie = function (movie) {
    var movieHTML = "<div class=\"row\"><p style=\"float: left;\"><img id=\"poster\" " +
        "src=\"https://image.tmdb.org/t/p/w185~IMGURL~\"/></p><p><h2>~MOVIETITLE~ " +
        "(~MOVIERELEASEYEAR~)</h2><br/><b>Directed by:</b> ~MOVIEDIRECTOR~<br/><b>Genres:</b> ~MOVIEGENRES~<br/>" +
        "<span class=\"rating\"><span class=\"star\"><i class=\"fa fa-star-o\" id=\"5\"></i></span><span class=\"star\">" +
        "<i class=\"fa fa-star-o\"id=\"4\"></i></span><span class=\"star\"><i class=\"fa fa-star-o\"id=\"3\"></i></span>" +
        "<span class=\"star\"><i class=\"fa fa-star-o\"id=\"2\"></i></span><span class=\"star\"><i class=\"fa fa-star-o\"" +
        "id=\"1\"></i></span></span></p></div><div class=\"row col-md-12\"><button style=\"margin-left: 15px\">Trailer" +
        "</button></div><div class=\"row col-md-12\"><div><h3>Description:</h3>~MOVIEDESCRIPTION~</div></div>";

    return movieHTML.replace('~IMGURL~', movie.poster).replace('~MOVIETITLE~', movie.title)
        .replace('~MOVIERELEASEYEAR~', movie.release_date.split('-')[0]).replace('~MOVIEDESCRIPTION~', movie.overview)
        .replace('~MOVIEGENRES~', movie.genres.join(', ')).replace('~MOVIEDIRECTOR~', movie.director.name);
};
<<<<<<< HEAD
=======

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
>>>>>>> c960e38ce46e126ccc277bda425475b66af1cfa9
