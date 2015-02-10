'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var photoSchema = new mongoose.Schema({
  serviceUser: {
    type: Schema.ObjectId,
    ref: 'ServiceUser'
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
  loc: [Number], //CWD--- indexed geospatial field from extracted data. [long,lat] format
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

photoSchema.index({ loc: '2dsphere' });

photoSchema.statics.findByPhotoId= function (id,cb) {
  return this.model('Photo').find({ id: id }, cb);
};

module.exports = mongoose.model('Photo', photoSchema);