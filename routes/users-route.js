
module.exports = function(app) {

    var colors = require('colors');

    var users = require('../lib/users.js');

    //username, password
    app.post('/users', function(req, res) {
        console.log('Attempting to create user'.yellow);
        if(req.body.username != null && req.body.password != null){
            users.add(req.body.username, req.body.password, function(status) {
                res.json(status);
            });
        }else{
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
            res.json({status: 400, reason: 'Improper parameters'});
        }

    });

}
