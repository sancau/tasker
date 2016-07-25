
'use strict';

const routers = require('./routers');
const models = require('./models');

const baseUrl = '/api';

const endpoints = {
  
  categories: {
    url: `${baseUrl}/categories`,
    router: routers.generic.crud,
    model: models.Category
  },

};

module.exports = endpoints;