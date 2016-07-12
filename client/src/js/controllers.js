
///////////////////////////////////////////////////////////////////////////////

var appCtrl = function() {
  let vm = this;
  this.title = 'YANA';
  return vm;
}
angular.module('app').controller('appCtrl', [appCtrl]);

///////////////////////////////////////////////////////////////////////////////

var tasksCtrl = function($http) {
  let vm = this;
  console.log('tasks');

  $http.get('http://localhost:3000/api/tasks')
  .then(
    (response) => vm.tasks = response.data,
    (error) => console.error(error)
  );

  return vm;
}
angular.module('app').controller('tasksCtrl', ['$http', tasksCtrl]);

///////////////////////////////////////////////////////////////////////////////

var typesCtrl = function($http) {
  let vm = this;
  console.log('types');

  $http.get('http://localhost:3000/api/types')
  .then(
    (response) => vm.types = response.data,
    (error) => console.error(error)
  );

  return vm;
}
angular.module('app').controller('typesCtrl', ['$http', typesCtrl]);