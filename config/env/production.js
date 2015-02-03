'use strict';

module.exports = {
  db: (process.env.MONGOLAB_URI || ('mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-prod')),
  /**
   * Database options that will be passed directly to mongoose.connect
   * Below are some examples.
   * See http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
   * and http://mongoosejs.com/docs/connections.html for more information
   */
  dbOptions: {
    /*
    server: {
        socketOptions: {
            keepAlive: 1
        },
        poolSize: 5
    },
    replset: {
      rs_name: 'myReplicaSet',
      poolSize: 5
    },
    db: {
      w: 1,
      numberOfRetries: 2
    }
    */
  },
  app: {
    name: 'fbUllr'
  },
  flickr:{
    clientID: process.env.FlickrKey,
    clientSecret: process.env.FlickrSecret ,
    callbackURL: 'https://ullrbaer.herokuapp.com/auth/flickr/callback'
  },  
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'https://ullrbaer.herokuapp.com/auth/facebook/callback'
  },
  twitter: {
    clientID: 'CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'https://ullrbaer.herokuapp.com/auth/twitter/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'https://ullrbaer.herokuapp.com/auth/google/callback'
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER',
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  }
};
