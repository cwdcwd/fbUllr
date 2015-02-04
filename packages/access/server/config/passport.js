'use strict';

var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GitHubStrategy = require('passport-github').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  LinkedinStrategy = require('passport-linkedin').Strategy,
  FlickrStrategy = require('passport-flickr').Strategy,  
  User = mongoose.model('User'),
  ServiceUser=mongoose.model('ServiceUser'),
  config = require('meanio').loadConfig();

module.exports = function(passport) {

  // Serialize the user id to push into the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize the user object based on a pre-serialized token
  // which is the user id
  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-salt -hashed_password', function(err, user) {
      done(err, user);
    });
  });

  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
        return done(null, user);
      });
    }
  ));

  // Use flickr strategy
  passport.use(new FlickrStrategy({
      consumerKey: config.flickr.clientID,
      consumerSecret: config.flickr.clientSecret,
      callbackURL: config.flickr.callbackURL,
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {
      console.log('back from flickr!');

      if (!req.user) { //CWD-- not logged in
console.log('user does not exist. creating');
        User.findOne({  //CWD-- see if you can find a service user. this is unlikely though. query needs adjustment
          'flickr.id_str': profile.id
        }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            console.log('found user. updating tokens...');
            // user.token=token;
            // user.tokenSecret=tokenSecret;

            return done(err, user);
          }
          user = new User({
            name: profile.displayName,
            username: profile.id,
            email: profile.displayName+'@flickr.com',
            provider: 'flickr',
            flickr: profile._json,
            roles: ['authenticated']
          });

          //save service user here with token, tokenSecret
          user.save(function(err) {
            if (err) {
              console.log(err);
              return done(null, false, {message: 'flickr login failed, email already used by other login strategy'});
            } else {
              return done(err, user);
            }
          });
        });

      } else {
        console.log('Logged in. Associate flickr account with user.',req.user);

        ServiceUser.findOne( { serviceName: 'flickr', serviceUserId: profile.id }, 
          function(err,serviceUser){
            if (err) {
              console.log('error while trying to find service user for flickr user',profile);
              return done(err);
            }

            if(serviceUser){
              console.log('we\'ve already got this service user. updating the tokens.');
              serviceUser.authUserToken=token;
              serviceUser.authTokenSecret=tokenSecret;
            }
            else {
              console.log('creating a new serviceUser record');
              serviceUser=new ServiceUser({
                serviceName: 'flickr',
                serviceUserId: profile.id,
                authUserToken: token,
                authTokenSecret: tokenSecret
              });
            }

            serviceUser.save(function(err){
              if(err){
                console.log('error saving service user data',serviceUser);
                return done(null, false, {message: 'flickr login failed, email already used by other login strategy'});
              } else {
                console.log('saved serviceUser record',serviceUser);
              }
            });

        });

        return done(null, req.user);
      }


    }
  ));


  // Use twitter strategy
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({
        'twitter.id_str': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          username: profile.username,
          provider: 'twitter',
          twitter: profile._json,
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'Twitter login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));

  // Use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username || profile.emails[0].value.split('@')[0],
          provider: 'facebook',
          facebook: profile._json,
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'Facebook login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));

  // Use google strategy
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value,
          provider: 'google',
          google: profile._json,
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'Google login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));

};
