
'use strict';

const MongoCollection = require('./MongoCollection');

class User extends MongoCollection {
  constructor() {
    const Schema = {
      username: [
        {
          valid: (value) => Boolean(value),          
          error: 'Field "username" is required for a User instance'
        },
        {
          valid: (value) => value.length > 7,
          error: 'Field "username" length must be more then 7 chars'
        }
      ],
      email: [
        {
          valid: (value) => Boolean(value),
          error: 'Field "email" is required for a User instance'
        }
      ]
    };
    super('users', Schema);
  }

  static getByID(id) {
    throw Error('NOT IMPLEMENTED');
  }
  
  static findAll(query) {
    throw Error('NOT IMPLEMENTED');
  }
}

module.exports = User;