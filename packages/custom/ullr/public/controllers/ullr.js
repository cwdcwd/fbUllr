'use strict';

/* jshint -W098 */
angular.module('mean.ullr').controller('UllrController', ['$scope', 'Global', 'Ullr',
  function($scope, Global, Ullr) {
    $scope.global = Global;
    $scope.package = {
      name: 'ullr'
    };
  }
]);
