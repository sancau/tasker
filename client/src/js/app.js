
'use strict';

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
      templateUrl: 'views/types.view.html',
    })
    
    .state('app.newtask', {
      url: 'newtask',
      controller: 'newTaskCtrl as vm',
      templateUrl: 'views/newtask.view.html',
      resolve: taskgroups
    })

    .state('app.newtype', {
      url: 'newtype',
      controller: 'newTypeCtrl as vm',
      templateUrl: 'views/newtype.view.html'
    })
    
    .state('app.itemslist', {
      url: 'itemslist',
      controller: 'itemsListCtrl as vm',
      templateUrl: 'views/itemslist.view.html'  
    })
  
};

angular
  .module('app', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', appConfig])
  .constant('BASE_API_URL', 'http://localhost:2500/api');
  
var taskgroups = {
  types: [
    'Collection',
    (Collection) => {
      let c = new Collection('types');
      return c.getAll()
      .then(
        (res) => res.data,
        (e) => console.error(e) 
      )
    }
  ]
};
