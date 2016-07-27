
'use strict';

const appConfig = function ($stateProvider, $urlRouterProvider) {
  
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
      resolve: types
    })

    .state('app.newtype', {
      url: 'newtype',
      controller: 'newTypeCtrl as vm',
      templateUrl: 'views/newtype.view.html'
    })
    
    .state('app.itemslist', {
      url: 'itemslist',
      controller: 'itemsListCtrl as vm',
      templateUrl: 'views/itemslist.view.html',
      resolve: itemslist  
    })
  
};

const devURL = 'http://localhost:5000/api';
const productionURL = 'http://139.59.144.80/api';

angular
  .module('app', ['ui.router', 'ui.bootstrap', 'ngAnimate'])
  .config(['$stateProvider', '$urlRouterProvider', appConfig])
  .constant('BASE_API_URL', productionURL);
  
  
///////////////////////////////////////////////////////////////////////////////  
// Resolves  
///////////////////////////////////////////////////////////////////////////////  
  
const types = {
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

const itemslist = {
  items: [
    'Collection',
    (Collection) => {
      let c = new Collection('items');
      return c.getAll()
      .then(
        (res) => res.data,
        (e) => console.error(e) 
      )
    }
  ],
  categories: [
    'Collection',
    (Collection) => {
      let c = new Collection('categories');
      return c.getAll()
      .then(
        (res) => res.data,
        (e) => console.error(e) 
      )
    }
  ]
}