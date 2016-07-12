
var appCtrl = function($scope) {
  vm = this
  this.title = 'AngularJS';
  return this
}

angular.module('app')
.controller('appCtrl', ['$scope', appCtrl]);
