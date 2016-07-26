
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

  $http.get('http://localhost:5555/api/tasks')
  .then(
    (response) => vm.tasks = response.data,
    (error) => console.error(error)
  );

  vm.confirmTask = function(task) {
    task.isConfirmed = true;
    $http.put('http://localhost:5555/api/tasks', task)
    .then(
      (res) => {
        console.log('task saved.')
      },
      (err) => console.log(err)
    );
  };

  vm.deleteTask = function(task) {
    $http({
      method: 'DELETE',
      url: 'http://localhost:5555/api/tasks',
      data: {_id: task._id},
      headers: {'Content-Type': 'application/json;charset=utf-8'}
    })
    .then(
      (res) => {
        let index = vm.tasks.indexOf(task);
        if (index > -1) {
          vm.tasks.splice(index, 1);
        }
      },
      (err) => console.log(err)
    );
  };

  return vm;
}
angular.module('app').controller('tasksCtrl', ['$http', tasksCtrl]);

///////////////////////////////////////////////////////////////////////////////

var typesCtrl = function($http) {
  let vm = this;

  $http.get('http://localhost:5555/api/types')
  .then(
    (response) => vm.types = response.data,
    (error) => console.error(error)
  );

  vm.deleteType = function(type) {
    $http({
      method: 'DELETE',
      url: 'http://localhost:5555/api/types',
      data: {_id: type._id},
      headers: {'Content-Type': 'application/json;charset=utf-8'}
    })
    .then(
      (res) => {
        let index = vm.types.indexOf(type);
        if (index > -1) {
          vm.types.splice(index, 1);
        }
      },
      (err) => console.log(err)
    );
  };

  vm.updateType = function(type) {    
    let url = `http://localhost:5555/api/types/${type._id}`;
    $http.put(url, type)
    .then(
      (res) => {
        vm.togleEditType(type);
      },
      (err) => console.log(err)
    );
  };

  vm.togleEditType = function(type) {
    type.editMode = !type.editMode;
  }

  return vm;
}
angular.module('app').controller('typesCtrl', ['$http', typesCtrl]);

///////////////////////////////////////////////////////////////////////////////

var newTaskCtrl = function($http, $state, types) {
  let vm = this;

  vm.typeOptions = types;

  console.log(types);

  vm.saveTask = function() {
    let newTask = {
      type: vm.type,
      room: vm.room,
      comment: vm.comment
    }; 
    
    $http.post('http://localhost:5555/api/tasks', newTask)
    .then(
      (res) => {
        $state.go('app.tasks');
      },
      (err) => console.log(err)
    );
  };

  return vm;
}
angular.module('app').controller('newTaskCtrl', ['$http', '$state', 'types', newTaskCtrl])

///////////////////////////////////////////////////////////////////////////////

var newTypeCtrl = function($http, $state) {
  let vm = this;

  vm.newType = {}

  vm.saveType = function() {    
    $http.post('http://localhost:5555/api/types', vm.newType)
    .then(
      (res) => {
        $state.go('app.types');
      },
      (err) => console.log(err)
    );
  };

  vm.goBack = () => $state.go('app.types');

  return vm;
}
angular.module('app').controller('newTypeCtrl', ['$http', '$state', newTypeCtrl]);

///////////////////////////////////////////////////////////////////////////////

const itemsListCtrl = (Item, Category) => {
  let vm = this;
  
  vm.test = 'ITEMS LIST';
  
  return vm;
};

angular.module('app')
.controller('itemsListCtrl', [
  'Item', 'Category', itemsListCtrl     
]);