
'use strict';

const routers = require('./routers');
const collections = require('./collections');

const baseUrl = '/api';

const endpoints = {
  
  // WORK

  taskgroups: {
    url: `${baseUrl}/types`,
    router: routers.generic.crud,
    collection: collections.Taskgroup
  },

  tasks: {
    url: `${baseUrl}/tasks`,
    router: routers.generic.crud,
    collection: collections.Task
  },

  // PERSONAL

  categories: {
    url: `${baseUrl}/categories`,
    router: routers.generic.crud,
    collection: collections.Category
  },
  
  items: {
    url: `${baseUrl}/items`,
    router: routers.generic.crud,
    collection: collections.Item
  }

};

module.exports = endpoints;