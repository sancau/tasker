
var appConfig = function ($stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise('/tasks');

  $stateProvider
  
  .state('tasks', {
    url: '/tasks',
    controller: 'tasksCtrl as vm',
    templateUrl: 'views/tasks.view.html'
  })

  .state('types', {
    url: '/types',
    controller: 'typesCtrl as vm',
    templateUrl: 'views/types.view.html'
  });

}

angular.module('app', [
  'ui.router'
]);

angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', appConfig]);



