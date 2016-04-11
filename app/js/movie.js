/**
 * Created by silver_android on 05/03/16.
 */

var api = new Api();

self.movieTitle;
self.movieId;
self.personName;
self.personId;

checkPath = function() {

    var path = window.location.pathname;
    if (path == '/movie') {
        loadMovie();
    } else if (path == '/person') {
        loadPerson();
    }
};

loadMovie = function () {
    var url = window.location.href;

    for (var i = 10; i > 0; i--) {
        var ratingStr = '<span class="star"><i class="fa fa-star-o" id="' + i + '"></i></span>'
        $('.rating').append(ratingStr);
    }

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
        api.getTrailerById(self.movieId, function (res) {
            processData("trailer", res)
        })
    }else{
        //add failsafe for no parameters provided
    }

};

loadPerson = function () {
    var url = window.location.href;

    self.personName = window.url('?name',url);
    self.personId = window.url('?id',url);
    var type = window.url('?type', url);

    $('.ratingContainer').css('display', 'none');
    $('.trailerContainer').css('display', 'none');

    if (type == 'director') {
        if (self.personId != null) {
            api.getDirectorById(self.personId, function (res) {
                console.log(res);
                processData('director-all', res);
            });
        } else if (self.personName != null) {
            api.getDirectorByName(self.personName, function (res) {
                processData('director-all', res);
            })
        } else {
            //shouldn't happen
        }
    } else if (type == 'actor') {
        if (self.personId != null) {
            api.getActorById(self.personId, function (res) {
                processData('cast-all', res);
            });
        } else if (self.personName != null) {
            api.getActorByName(self.personName, function (res) {
                processData('cast-all', res);
            })
        } else {
            //shouldn't happen
        }
    } else {
        //shouldn't happen
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
            setRatingStars(data['rating']);
            setRating(data['average'],data['total']);
            break;
        case "director":
            setupDirectorInfo(data);
            break;
        case 'director-all':
            setupDirector(data);
            break;
        case "casts":
            setupCastsInfo(data['casts']);
            break;
        case 'cast-all':
            setupCast(data);
            break;
        case "trailer":
            setTrailerURL(data['trailer']['trailer']);
            break;
        default:
            console.log('Not a case');
    }

};

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
    $('.titleContainer').append(movieTitleSTR);

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
    var overviewSTR = '<h1>~TITLE~: </h1><p>~TEXT~</p>';
    overviewSTR = overviewSTR.replace('~TITLE~', 'Overview');
    overviewSTR = overviewSTR.replace('~TEXT~',movie['overview']);
    $('.detailsContainer').append(overviewSTR);

};

setupCastsInfo = function(casts) {

    var castTitle = '<h1>Casts: </h1>';
    $('.castsContainer').append(castTitle);

    var castTemplate = '<p><strong>~CHAR~</strong> played by <strong><a href="/person?id=~ACTORID~&type=actor">~ACTORNAME~</a></strong></p>';

    for(var i=0; i<casts.length; i++) {

        var castTemp = castTemplate;
        castTemp = castTemp.replace('~CHAR~',casts[i]['character']);
        castTemp = castTemp.replace('~ACTORNAME~',casts[i]['name']);
        castTemp = castTemp.replace('~ACTORID~',casts[i]['id']);

        $('.castsContainer').append(castTemp);
    }

};

setupCast = function (cast) {
    cast = cast['cast'];
    console.log(cast);
    api.getMoviesDirected(cast['moviedb_id'], function (res) {
        setupMoviesDirected(res);
    });
    api.getMoviesPlayed(cast['moviedb_id'], function (res) {
        setupMoviesPlayed(res);
    });//HTML Page Title
    $('title').html(cast['name']);

    //Cast Name
    var actorNameSTR = '<h1>~ACTORNAME~</h1>';
    actorNameSTR = actorNameSTR.replace('~ACTORNAME~', cast['name']);
    $('.titleContainer').append(actorNameSTR);

    //Cast Image
    var imgSTR = cast['imageurl'] == null ? '<iframe width="185" height="278" class="alternate-genre-poster"></iframe>'
        : '<img src="https://image.tmdb.org/t/p/w185/~IMGURL~" width="185" height="278">';
    imgSTR = imgSTR.replace('~IMGURL~', cast['imageurl']);
    $('.imageContainer').append(imgSTR);

    //Cast biography
    if (cast['bio'] != null) {
        var biographyStr = '<h1>~TITLE~: </h1><p>~TEXT~</p>';
        biographyStr = biographyStr.replace('~TITLE~', 'Biography');
        biographyStr = biographyStr.replace('~TEXT~', cast['bio']);
        $('.detailsContainer').append(biographyStr);
    } else {
        $('#details').css('display', 'none');
    }
};

setupDirectorInfo = function (director) {
    director = director['director'];
    console.log(director);

    //Director name
    var directorSTR = '<h3><strong>Directed by:</strong> <a href="/person?id=~DIRID~&type=director">~DIRNAME~</a></h3>';
    directorSTR = directorSTR.replace(/~DIRNAME~/g, director['name']);
    directorSTR = directorSTR.replace(/~DIRID~/g, director['id']);
    $('.directorContainer').append(directorSTR);

};

setupDirector = function (director) {
    director = director['director'];
    api.getMoviesDirected(director['moviedb_id'], function (res) {
        setupMoviesDirected(res);
    });
    api.getMoviesPlayed(director['moviedb_id'], function (res) {
        setupMoviesPlayed(res);
    });

    //HTML Page Title
    $('title').html(director['name']);

    //Director Name
    var directorNameSTR = '<h1>~DIRECTORNAME~</h1>';
    directorNameSTR = directorNameSTR.replace('~DIRECTORNAME~', director['name']);
    $('.titleContainer').append(directorNameSTR);

    //Director Image
    var imgSTR = '<img src="https://image.tmdb.org/t/p/w185/~IMGURL~" width="185" height="278">';
    imgSTR = imgSTR.replace('~IMGURL~',director['imageurl']);
    $('.imageContainer').append(imgSTR);

    //Director biography
    if (director['bio'] != null) {
        var biographyStr = '<h1>~TITLE~: </h1><p>~TEXT~</p>';
        biographyStr = biographyStr.replace('~TITLE~', 'Biography');
        biographyStr = biographyStr.replace('~TEXT~', director['bio']);
        $('.detailsContainer').append(biographyStr);
    } else {
        $('#details').css('display', 'none');
    }
};

generateMovieDiv = function (movieId, movieTitle, posterUrl) {

    var divTemplate = '<div class="movieBox"><a href="./movie?id=~MOVIEID~"><div class="imageContainer"><img src="https://image.tmdb.org/t/p/w185~IMGURL~" width="185" height="278"/></div><div class="movieInfo"><h4>~MOVIETITLE~</h4></div></a></div>';

    divTemplate = divTemplate.replace(/~IMGURL~/g, posterUrl);
    divTemplate = divTemplate.replace(/~MOVIETITLE~/g, movieTitle);
    divTemplate = divTemplate.replace(/~MOVIEID~/g, movieId);

    return divTemplate;
};

setupMoviesDirected = function (movies) {
    movies = movies['movies'];
    if (movies && movies.length != 0) {
        $('.directedContainer').append('<h1>Movies directed: </h1>');
    } else {
        $('#directed').css('display', 'none');
    }
    for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];
        $('.directedContainer').append(generateMovieDiv(movie['id'], movie['title'], movie['poster']));
    }
};

setupMoviesPlayed = function (movies) {
    movies = movies['movies'];
    if (movies && movies.length != 0) {
        $('.playedContainer').append('<h1>Movies acted in: </h1>');
    } else {
        $('#played').css('display', 'none');
    }
    for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];
        $('.playedContainer').append(generateMovieDiv(movie['id'], movie['title'], movie['poster']));
    }
};

$(document).on('click', '.star', function() {
    var rating = 10 - ($(this).index());
    var currentRating = 0;

    for (var i = 1; i <= 10; i++) {
        var id = '#' + i;
        if ($(id).hasClass('fa-star-o')) {
            currentRating = i - 1;
            break;
        } else if ($('#10').hasClass('fa-star')) {
            currentRating = 10;
            break;
        }
    }

    if (currentRating == rating) {
        if (self.movieId != null) {
            api.removeRatingById(self.movieId, function (result) {
                setRatingStars(0);
            });
        } else if (self.movieTitle != null) {
            api.removeRatingByTitle(self.movieTitle, function (result) {
                setRatingStars(0);
            });
        } else {
            console.log('Bad parameters');
        }
    }
    else {
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
    }
});

setRating = function(avg,total) {
    var template = '<h1>( ~AVG~/10 with ~COUNT~ votes )</h1>';
    template = template.replace(/~AVG~/g,avg);
    template = template.replace(/~COUNT~/g,total);
    $(".ratingContainer").append(template);
}

setRatingStars = function(rating) {

    for (var i = 1; i <= 10; i++) {
        var id = '#' + i;
        if (i <= rating) {
            $(id).removeClass('fa-star-o').addClass('fa-star').css('color', 'gold');
        } else {
            $(id).removeClass('fa-star').addClass('fa-star-o').css('color', '');
        }
    }
}

window.addEventListener('keydown', function (e) {
    if (e.keyCode == 27) {
        showHideVideo('hide');
    }
});

setTrailerURL = function(key) {
    var src = 'http://www.youtube.com/embed/' + key + '?enablejsapi=1';
    $('.trailerVideo').prop('src', src);
};

showHideVideo = function (state) {
    var div = document.getElementById("overlay");
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    console.log($('#overlay').css('display'));
    var hide = state == 'hide';
    if (hide) {
        $('#overlay').addClass('hide');
    } else {
        $('#overlay').removeClass('hide');
    }
    console.log($('#overlay').css('display'));
    var func = state == 'hide' ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
};
