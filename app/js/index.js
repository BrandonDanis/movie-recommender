var api = new Api();

logout = function () {
    api.logout();
};

$('#search-box').autocomplete({
    source: function (req, res) {
        $.ajax({
            url: '/search?term=' + req.term,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                // console.log(data);
                var objects = data['movies'];
                var list = [];
                for (var key in objects) {
                    if (objects.hasOwnProperty(key)) {
                        var object = objects[key];
                        // console.log(objects[key]);
                        // console.log(object['title']);
                        var listObject = {
                            id: object['id'],
                            title: object['title'],
                            value: object['title'],
                            imageURL: object['poster'],
                            description: object['overview']
                        };
                        list.push(listObject);
                    }
                }
                // console.log(list);
                res(list);
            }
        });
    },
    select: function (event, ui) {
        window.location = 'http://localhost:8080/movie?id=' + ui.item.id;
    }
}).autocomplete("instance")._renderItem = function (ul, item) {
    if (item.description.length > 78)
        item.description = item.description.substring(0, 75) + '...';
    return $("<li>")
        .append("<div><p style='float: left; padding-right: 5px; margin: 0'> <img id='autocomplete-icon' " +
            "height='50px' src=https://image.tmdb.org/t/p/w185" + item.imageURL + "></p><p style='font-weight: 300'><b>"
            + item.title + "</b><br>" + item.description + "</p></div>")
        .appendTo(ul);
};

window.addEventListener('keydown', function (e) {
    if (e.keyCode === 114 || ((e.metaKey || e.ctrlKey) && e.keyCode === 70)) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
        setTimeout(function () {
            $("#search-box").focus();
        }, 1000);
        e.preventDefault();
    }
});

loadMovies = function () {

    api.getAllMovies(function (res) {

        var moviesArray = res['movies'];

        if (res['status'] == 200) {

            for (var i = 0; i < (200 || moviesArray.length); i++) {
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
