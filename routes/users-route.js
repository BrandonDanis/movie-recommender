
module.exports = function(app) {

    var colors = require('colors');

    var users = require('../lib/users.js');

    //username, password
    app.post('/users', function(req, res) {
        console.log('Attempting to create user'.yellow);
        if(req.body.username != null && req.body.password != null && req.body.confirmPassword != null && req.body.email != null){
            users.add(req.body.username, req.body.password, req.body.confirmPassword, req.body.email, function(status) {
                res.json(status);
            });
        }else{
            res.status(400);
            res.json({status: 400, reason: 'Improper parameters'});
        }
    });


    app.get('/users', function(req,res) {

        if(req.query.username != null){
            console.log('Attempting to find user by username.'.yellow);
            users.get.byUsername(req.query.username, function(status) {
                res.json(status);
            });
        }else if(req.query.userId != null){
            console.log('Attempting to find user by id.'.yellow);
            users.get.byId(req.query.userId, function(status) {
                res.json(status);
            });
        }else{
            res.status(400);
            res.json({status: 400, reason: 'Improper parameters'});
        }

    });

    app.delete('/users', function(req, res) {

        if(req.query.username != null){
            console.log('Attempting to delete user by username'.yellow);
            users.delete.byUsername(req.query.username, function(status) {
                res.json(status);
            });
        }else if(req.query.userId != null){
            console.log('Attempting to delete user by id'.yellow);
            users.delete.byId(req.query.userId, function(status) {
                res.json(status);
            });
        }else{
            res.status(400);
            res.json({status: 400, reason: 'Improper parameters'});
        }

    });

  app.post('/rating', function (req, res) {

      if(req.session.username != null && req.body.movieId != null && req.body.rating != null) {
          var body = req.body;
          var isID = body.movieId.match(/[0-9]+/g);

          if (isID) {
              users.postRating.withID(req.session.username, body.movieId, body.rating, function (status) {
                  res.json(status);
              });
          }else{
              users.postRating.withTitle(req.session.username, body.movieId, body.rating, function (status) {
                  res.json(status);
              });
          }
      }else{
          res.json({status: 400, reason: 'Improper parameters'});
      }

  });

  app.get('/rating', function(req,res) {

     if(req.session.username != null){

         if(req.query.movieId != null){
            users.getRating.byId(req.session.username, req.query.movieId, function(status) {
                res.json(status);
            });
         }else if(req.query.movieTitle != null){
             users.getRating.byTitle(req.session.username, req.query.movieTitle, function(status) {
                 res.json(status);
             });
         }else{
             res.json({status: 400, reason: 'Movie info param isn\'t valid.'});
         }

     }else{
         res.json({status: 400, reason: 'Session username isn\'t valid.'});
     }

  });

  app.delete('/rating', function (req, res) {
        if(req.session.username != null){

            if(req.body.movieId != null){
                users.removeRating.byId(req.session.username, req.body.movieId, function(status) {
                    res.json(status);
                });
            }else if(req.body.movieTitle != null){
                users.removeRating.byTitle(req.session.username, req.body.movieTitle, function(status) {
                    res.json(status);
                });
            }else{
                res.json({status: 400, reason: 'Movie info param isn\'t valid.'});
            }

        }else{
            res.json({status: 400, reason: 'Session username isn\'t valid.'});
        }
    });

    app.post('/setup', function (req, res) {

        for (var key in req.body) {
            var changedKey = key.replace("[]", "");
            req.body[changedKey] = req.body[key];
            if (key.indexOf('[]') > -1)
                delete req.body[key];
        }

        console.log(req.body);

        var movieIDs = req.body.movieIDs;
        var favGenres = req.body.favGenres;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        if (firstName != null && lastName != null && favGenres != null && movieIDs != null) {
            favGenres = favGenres instanceof Array ? favGenres : favGenres.split(', ');
            movieIDs = movieIDs instanceof Array ? movieIDs : movieIDs.split(', ');
            users.setup(firstName, lastName, favGenres, req.session.username, movieIDs, function (result) {
                res.json(result);
            });
        } else {
            res.status(400).json({status: 400, error: 'Improper body parameters'});
        }
    });

    app.get('/getUserInfo', function (req, res) {

        if(req.session.username != null) {
            users.getUserInfo(req.session.username, function(status) {
                res.json(status);
            });
        }else{
            res.json({status: 400, reason: 'Session username isn\'t valid.'});
        }

    });

};
