'use strict';

angular.module('mean.ullr').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('ullr example page', {
      url: '/ullr/example',
      templateUrl: 'ullr/views/index.html'
    });
  }
]);
