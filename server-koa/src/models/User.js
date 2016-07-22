
'use strict';

const MongoCollection = require('./MongoCollection');

class User extends MongoCollection { 
  constructor(username, email) {
    const Schema = {
      username: [
        {
          valid: (value) => Boolean(value),          
          error: 'Field "username" is required for a User instance'
        },
        {
          valid: (value) => value != null ? value.length > 7 : false,
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
    
    this.username = username;
    this.email = email;
  }
  
  static getByID(id) {
    return MongoCollection.getByID(id, 'users');
  }
  
  static findAll(query) {
    return MongoCollection.findAll(query, 'users');
  }
}

module.exports = User;