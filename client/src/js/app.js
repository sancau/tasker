
var appConfig = function ($stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise('/tasks');

  $stateProvider

  .state('app', {
    url: '/',
    templateUrl: 'views/app.view.html'
  })
  
  .state('app.tasks', {
    url: 'tasks',
    controller: 'tasksCtrl as vm',
    templateUrl: 'views/tasks.view.html'
  })

  .state('app.types', {
    url: 'types',
    controller: 'typesCtrl as vm',
    templateUrl: 'views/types.view.html'
  });
}

angular.module('app', [
  'ui.router'
]);

angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', appConfig]);



