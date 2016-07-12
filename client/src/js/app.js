
var appConfig = function ($stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise('/tasks');

  $stateProvider
  
  .state('tasks', {
    url: '/tasks',
    controller: function() {
      console.log('tasks controller');
    },
    template: '<h1> Задачи </h1><hr />'
  })

  .state('types', {
    url: '/types',
    controller: function(){},
    template: '<h1> Типы задач </h1><hr />'
  });

}

angular.module('app', [
  'ui.router'
]);

angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', appConfig]);



