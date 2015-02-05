'use strict';
var _=require('lodash');

var options= {
      nobrowser: true,
      silent: false,
      force_auth: true,
      api_key: process.env.FlickrKey,
      secret: process.env.FlickrSecret 
  };

var dms2deg=function(s) { //CWD -- from: http://stackoverflow.com/questions/5970961/regular-expression-javascript-convert-degrees-minutes-seconds-to-decimal-degree
  
  var sw = /[sw]/i.test(s); // Determine if south latitude or west longitude
  var f = sw? -1 : 1; // Determine sign based on sw (south or west is -ve)
  var bits = s.match(/[\d.]+/g); // Get into numeric parts
  var result = 0;
  
  for (var i=0, iLen=bits.length; i<iLen; i++) { // Convert to decimal degrees
    // String conversion to number is done by division
    // To be explicit (not necessary), use 
    //   result += Number(bits[i])/f
    result += bits[i]/f;
    // Divide degrees by +/- 1, min by +/- 60, sec by +/-3600
    f *= 60;
  }

  return result;
};

var extractGPSCoords=function(photo){
  var longLabel='GPSLongitude',latLabel='GPSLatitude',longRefLabel='GPSLongitudeRef',latRefLabel='GPSLatitudeRef'; //CWD-- exif constants
  var loc=new Array();

  if(photo.exif){ //CWD-- extract exact coords from exif
    var indexLong=_.findIndex(photo.exif, { 'tag': longLabel });
    var indexLat=_.findIndex(photo.exif, { 'tag': latLabel }); 

    if((indexLong!=-1) && (indexLat!=-1)){ //CWD-- do we have exif long/lat tags?
      var strLong=photo.exif[indexLong].raw._content;
      var strLat=photo.exif[indexLat].raw._content;
      indexLong=_.findIndex(photo.exif, { 'tag': longRefLabel });
      indexLat=_.findIndex(photo.exif, { 'tag': latRefLabel }); 

      if((indexLong!=-1) && (indexLat!=-1)){ //CWD-- if we have both GPS refs then we're good to go
        var strLong=photo.exif[indexLong].raw._content.charAt(0)+' '+strLong;
        var strLat=photo.exif[indexLat].raw._content.charAt(0)+' '+strLat;

        console.log(strLong,strLat);

        loc=[dms2deg(strLong),dms2deg(strLat)];
      } else{ console.log('could not convert exif to long/lat. no ref tags.'); }
    } else{ console.log('could not convert exif to long/lat. no long/lat tags.'); }
  } 

  if((loc.length!=2) && photo.geo) { //CWD-- fallback on the flickr determined long/lat if we can't get both long and lat right from exif
    loc=[photo.geo.location.longitude,photo.geo.location.latitude];
  } else{ console.log('could not convert exif nor extract flickr geo data.'); }
 
  return loc;
};


module.exports.options=options;
module.exports.dms2deg=dms2deg;
module.exports.extractGPSCoords=extractGPSCoords;