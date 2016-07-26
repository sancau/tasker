
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

var tasksCtrl = function(Collection) {
  let vm = this;
  
  let c = new Collection('tasks');

  c.getAll()
  .then(
    (response) => vm.tasks = response.data,
    (error) => console.error(error)
  );

  vm.confirmTask = function(task) {
    task.isConfirmed = true;
    c.save(task)
    .then(
      (res) => {
        console.log('task saved.')
      },
      (err) => console.log(err)
    );
  };

  vm.deleteTask = function(task) {
    c.remove(task)
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
angular.module('app').controller('tasksCtrl', ['Collection', tasksCtrl]);

///////////////////////////////////////////////////////////////////////////////

var typesCtrl = function(Collection) {
  let vm = this;

  let c = new Collection('types');

  c.getAll()
  .then(
    (response) => vm.types = response.data,
    (error) => console.error(error)
  );

  vm.deleteType = function(type) {
    c.remove(type)
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
    c.save(type)
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
angular.module('app').controller('typesCtrl', ['Collection', typesCtrl]);

///////////////////////////////////////////////////////////////////////////////

var newTaskCtrl = function($state, types, Collection) {
  let vm = this;
  let c = new Collection('tasks');
  
  vm.typeOptions = types;

  console.log(types);

  vm.saveTask = function() {
    let newTask = {
      type: vm.type,
      room: vm.room,
      comment: vm.comment
    }; 
    
    c.save(newTask)
    .then(
      (res) => {
        $state.go('app.tasks');
      },
      (err) => console.log(err)
    );
  };

  return vm;
}
angular.module('app').controller('newTaskCtrl', ['$state', 'types', 'Collection', newTaskCtrl])

///////////////////////////////////////////////////////////////////////////////

var newTypeCtrl = function($state, Collection) {
  let vm = this;
  let c = new Collection('types');
  
  vm.newType = {}

  vm.saveType = function() {    
    c.save(vm.newType)
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
angular.module('app').controller('newTypeCtrl', ['$state', 'Collection', newTypeCtrl]);

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