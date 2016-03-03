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
                console.log(data);
                var objects = data['movies'];
                var list = [];
                for (var key in objects) {
                    if (objects.hasOwnProperty(key)) {
                        var object = objects[key];
                        console.log(objects[key]);
                        console.log(object['title']);
                        var listObject = {label: object['title'], value: object['id']};
                        list.push(listObject);
                    }
                }
                console.log(list);
                res(list);
            }
        });
    }
});

loadMovies = function() {

    api.getAllMovies(function(res){

        var moviesArray = res['movies'];

        if(res['status'] == 200){

            for(var i=0;i<moviesArray.length;i++){
                $('#movieContainer').append(generateMovieDiv(moviesArray[i]['title'],moviesArray[i]['poster']));
            }

        }else{
            console.log('Error getting movies');
        }

    });

};

generateMovieDiv = function(movieTitle,posterUrl) {

    var divTemplate = '<div class="movieBox"><div class="imageContainer"><img src="https://image.tmdb.org/t/p/w185~IMGURL~" width="185" height="278"/></div><div class="movieInfo"><h4>~MOVIETITLE~</h4></div></div>';

    divTemplate = divTemplate.replace(/~IMGURL~/g, posterUrl);
    divTemplate = divTemplate.replace(/~MOVIETITLE~/g, movieTitle);

    return divTemplate;

};
