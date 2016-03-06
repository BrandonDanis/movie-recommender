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

};

generateMovie = function (movie) {
    var movieHTML = "<div class=\"row\"><p style=\"float: left;\"><img id=\"poster\" " +
        "src=\"https://image.tmdb.org/t/p/w185~IMGURL~\"/></p><p><h2>~MOVIETITLE~ " +
        "(~MOVIERELEASEYEAR~)</h2><br/><b>Directed by:</b> ~MOVIEDIRECTOR~<br/><b>Genres:</b> ~MOVIEGENRES~<br/>" +
        "<span class=\"rating\"><span class=\"star\"><i class=\"fa fa-star-o\"></i></span><span class=\"star\">" +
        "<i class=\"fa fa-star-o\"></i></span><span class=\"star\"><i class=\"fa fa-star-o\"></i></span>" +
        "<span class=\"star\"><i class=\"fa fa-star-o\"></i></span><span class=\"star\"><i class=\"fa fa-star-o\"></i>" +
        "</span></span></p></div><div class=\"row col-md-12\"><button style=\"margin-left: 15px\">Trailer</button>" +
        "</div><div class=\"row col-md-12\"><div><h3>Description:</h3>~MOVIEDESCRIPTION~</div></div>";

    return movieHTML.replace('~IMGURL~', movie.poster).replace('~MOVIETITLE~', movie.title)
        .replace('~MOVIERELEASEYEAR~', movie.release_date.split('-')[0]).replace('~MOVIEDESCRIPTION~', movie.overview)
        .replace('~MOVIEGENRES~', movie.genres.join(', ')).replace('~MOVIEDIRECTOR~', movie.director.name);
};
