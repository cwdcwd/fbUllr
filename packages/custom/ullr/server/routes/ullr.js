'use strict';



var serviceUsers = require('../controllers/serviceUser');
var photos = require('../controllers/photo');


/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Ullr, app, auth, database) {

  app.get('/ullr/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/ullr/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/ullr/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/ullr/example/render', function(req, res, next) {
    Ullr.render('index', {
      package: 'ullr'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });


  app.route('/ullr/serviceUsers')
    .get(auth.requiresAdmin, serviceUsers.all)
    .post(auth.requiresAdmin, serviceUsers.create); //CWD-- this one is not necessarily needed give then passportjs authorization we've installed

/*
  app.route('/ullr/serviceUsers/:userId')
    .get(auth.isMongoId, serviceUsers.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, articles.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, articles.destroy);
*/

  app.route('/ullr/photos')
    .get(auth.requiresLogin,photos.all);

};
