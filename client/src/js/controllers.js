
///////////////////////////////////////////////////////////////////////////////

var appCtrl = function($state) {
  let vm = this;
  vm.title = 'YANA';

  vm.isActive = function(stateName) {
    return (stateName === $state.current.name);
  };

  return vm;
}
angular.module('app').controller('appCtrl', ['$state', appCtrl]);

///////////////////////////////////////////////////////////////////////////////

var tasksCtrl = function($http) {
  let vm = this;

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

  $http.get('http://localhost:3000/api/types')
  .then(
    (response) => vm.types = response.data,
    (error) => console.error(error)
  );

  return vm;
}
angular.module('app').controller('typesCtrl', ['$http', typesCtrl]);