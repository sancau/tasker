
'use strict';

const MongoCollection = require('./MongoCollection');

class CategoriesCollection extends MongoCollection { 
  constructor(dbConnection) {
    const Schema = {
      name: [
        {
          valid: (value) => Boolean(value),          
          error: 'Field <name> is required for a Category instance'
        }
      ],
    };
    super('categories', Schema, dbConnection);
  }
}

module.exports = CategoriesCollection;