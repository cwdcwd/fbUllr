var mongoose = require('mongoose')

var photoSchema = mongoose.Schema({
	servicePhotoId: String,
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
      "location": { "latitude": Number, "longitude": Number, "accuracy": Number, "context": Number, 
      "neighbourhood": { "_content": String, "place_id": String, "woeid": String }, 
      "locality": { "_content": String, "place_id": String, "woeid": String }, 
      "county": { "_content": String, "place_id": String, "woeid": String }, 
      "region": { "_content": String, "place_id": String, "woeid": String }, 
      "country": { "_content": String, "place_id": String, "woeid": String }, 
      "place_id": String, "woeid": String } 
    }
});

module.exports = mongoose.model('Photo', photoSchema);