
var appConfig = function ($stateProvider) {
  console.log('app config..');
}

angular.module('app', [
  'ui.router'
]);

angular.module('app')
.config(['$stateProvider', appConfig]);



