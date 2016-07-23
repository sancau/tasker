
'use strict';

const MongoCollection = require('./MongoCollection');

class ItemsCollection extends MongoCollection { 
  constructor(dbConnection) {
    const Schema = {
      name: [
        {
          valid: (value) => Boolean(value),          
          error: 'Field <name> is required for a User instance'
        }
      ],
      category: [
        {
          valid: (value) => Boolean(value) && value.match(/^[0-9a-fA-F]{24}$/),
          error: 'Field <category> is required and has to be a valid ObjectID value'
        }
      ],
      quantity: [
        {
          valid: (value) => !Boolean(value) || value.match(/[0-9]/),
          error: 'Field <quantity> has to be a number'
        }
      ],
      isCompleted: [
        {
          valid: (value) => !Boolean(value) || typeof(value) === 'boolean'
        }        
      ]      
    };
    super('items', Schema, dbConnection);
  }
}

module.exports = ItemsCollection;