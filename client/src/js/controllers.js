
var appCtrl = function($scope) {
  let vm = this
  this.title = 'AngularJS';
  return this
}

angular.module('app')
.controller('appCtrl', ['$scope', '$state', appCtrl]);
