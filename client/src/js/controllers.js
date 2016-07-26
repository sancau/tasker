
///////////////////////////////////////////////////////////////////////////////

var appCtrl = function($state) {
  let vm = this;
  vm.title = 'YANA';

  vm.isActive = function(stateName) {
    return (stateName === $state.current.name);
  };

  return vm;
}

angular
  .module('app')
  .controller('appCtrl', ['$state', appCtrl]);

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
angular
  .module('app')
  .controller('typesCtrl', ['Collection', typesCtrl]);

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

angular
  .module('app')
  .controller('newTaskCtrl', ['$state', 'types', 'Collection', newTaskCtrl])

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

angular
  .module('app')
  .controller('newTypeCtrl', ['$state', 'Collection', newTypeCtrl]);


///////////////////////////////////////////////////////////////////////////////
// ITEMS / CATEGORIES
///////////////////////////////////////////////////////////////////////////////

const itemsListCtrl = function (items, categories, Collection) {
  
  let vm = this;

  vm.items = items;
  vm.categories = categories;
  
  for (let category of vm.categories) {
    category.items = vm.items.filter((i) => {
      return i.category === category._id
    });
  }
  
  vm.toggleEditItemMode = () => {
    vm.editItemMode = !vm.editItemMode;
  }; 
    
  vm.toggleEditCategoryMode = () => {
    vm.editCategoryMode = !vm.editCategoryMode;    
  };
  
  vm.confirmItem = (item) => {
    item.confirmed = true;
    let c = new Collection('items');
    c.save(item)
    .then(
      (r) => item.confirmed = false,
      (e) => console.error(e)
    )        
  };
  
  // New category  
  vm.toggleNewCategoryMode = 
    () => vm.newCategoryMode = !vm.newCategoryMode;
  
  vm.newCategory = {};
  vm.addCategory = () => {
    let c = new Collection('categories');
    c.save(vm.newCategory)
    .then(
      (res) => {
        res.data.items = [];
        vm.categories.push(res.data);
        vm.newCategory = {};
        vm.toggleNewCategoryMode(); 
      },
      (err) => console.error(err)
    ) 
  };
  
  // New item
  vm.toggleNewItemMode = 
    (category) => { 
      category.newItemMode = !category.newItemMode;
      category.newItem = {}; 
  };
  
  vm.addItem = (category) => {
    let c = new Collection('items');
    category.newItem.category = category._id;
    c.save(category.newItem)
    .then(
      (res) => { 
        category.items.push(res.data);
        category.newItem = {};
        vm.toggleNewItemMode(category);    
      },
      (err) => console.error(err)
    ) 
  };
  
  // Category details
  vm.getCategoryHeading = (category) => {
    let itemsCount = category.items == null ? 0 : category.items.length;
    let confirmedCount = category.items == null ? 0 : 
      category.items.filter((v) => v.confirmed).length; 
    return `${category.name} (${confirmedCount} / ${itemsCount})`
  };
  vm.toggleCategoryDetails = (category) => {
    category.expanded = category.expanded == null ? true : !category.expanded;
  };
  
  vm.confirmItem = (item) => {
    let c = new Collection('items');
    item.confirmed = true;
    c.save(item).then((r) => true, (e) => console.error(e));    
  };
  
  vm.deleteItem = (item, category) => {
    let c = new Collection('items');
    c.remove(item)
    .then((r) =>  {
      let index = category.items.indexOf(item);
      if (index > -1) {
        category.items.splice(index, 1);
      }
    }, 
    (e) => console.error(e));    
  };
  
  vm.deleteCategory = (category) => {
    console.log(category);  
    let c = new Collection('categories');
    c.remove(category)
    .then((r) => { 
      let index = vm.categories.indexOf(category);
      if (index > -1) {
        vm.categories.splice(index, 1);
      }
    }, 
    (e) => console.error(e));    
  };
  
  return vm;
};

angular.module('app')
.controller('itemsListCtrl', ['items', 'categories',
  'Collection', itemsListCtrl     
]);
