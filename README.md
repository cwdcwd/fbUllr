# fbUllr

#### Requires:
- mongodb
- redis

#### 

##### Environmental vars 
- FlickrKey: the app's API KEY
- FlickrSecret: the app's API SECRET
- FLICKR_USER_ID: the calling user.  **This to be moved to the data store and loaded in dynamically later**
- FLICKR_ACCESS_TOKEN: the calling user's oAuth access token.  **This to be moved to the data store and loaded in dynamically later**
- FLICKR_ACCESS_TOKEN_SECRET: the calling user's oAuth secret token.  **This to be moved to the data store and loaded in dynamically later**

run the photo processor standalone with the env vars in a file called localProcess.env
```
foreman run node photoProcessor.js -e localProcess.env
```

run the exif/geo processor standalone with the env vars in a file called localProcess.env
```
foreman run node exifProcessor.js -e localProcess.env
```

![Ull](http://upload.wikimedia.org/wikipedia/commons/9/93/Uller_by_W._Heine.jpg)
