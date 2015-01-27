'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var photoSchema = new mongoose.Schema({
  user: {
      type: Schema.ObjectId,
      ref: 'User'
  },
	id: String,
	owner: String,
	secret: String,
 //   server: String,
 //   farm: String,
    title: String,
    ispublic: Boolean,
 //   isfriend: Boolean,
 //   isfamily: Boolean,

 	exif: [
 		{ 
 			tagspace: String,
 			tagspaceid: Number,
 			tag: String,
 			label: String,
 			raw: { _content: String } 
 		}
 	],

    geo: {  
      'location': { 'latitude': Number, 'longitude': Number, 'accuracy': Number, 'context': Number, 
      'neighbourhood': { '_content': String, 'place_id': String, 'woeid': String }, 
      'locality': { '_content': String, 'place_id': String, 'woeid': String }, 
      'county': { '_content': String, 'place_id': String, 'woeid': String }, 
      'region': { '_content': String, 'place_id': String, 'woeid': String }, 
      'country': { '_content': String, 'place_id': String, 'woeid': String }, 
      'place_id': String, 'woeid': String } 
    }
});

photoSchema.statics.findByPhotoId= function (cb) {
  return this.model('PhotoModel').find({ id: this.id }, cb);
};

module.exports = mongoose.model('PhotoModel', photoSchema);