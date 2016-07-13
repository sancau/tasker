
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
  })
  
  .state('app.newtask', {
    url: 'newtask',
    controller: 'newTaskCtrl as vm',
    templateUrl: 'views/newtask.view.html',
    resolve: typesResolve
  })

  .state('app.newtype', {
    url: 'newtype',
    controller: 'newTypeCtrl as vm',
    templateUrl: 'views/newtype.view.html'
  });
}

angular.module('app', [
  'ui.router'
]);

angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', appConfig]);

var typesResolve = {
  types: [
    '$http',
    ($http) => {
      return $http.get('http://localhost:5555/api/types')
      .then(
        (res) => res.data,
        (err) => console.error(err)
      );
    }
  ]
}


