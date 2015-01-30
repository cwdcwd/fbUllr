'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Ullr = new Module('ullr');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Ullr.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Ullr.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Ullr.menus.add({
    title: 'ullr example page',
    link: 'ullr example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Ullr.aggregateAsset('css', 'ullr.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Ullr.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Ullr.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Ullr.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Ullr;
});
