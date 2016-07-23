
'use strict';

const MongoCollection = require('./MongoCollection');

class UsersCollection extends MongoCollection { 
  constructor(dbConnection) {
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
        },
        {
          valid: (value) => value != null ? value.indexOf('@') > -1 : false,
          error: 'Email address is invalid'
        }
      ]
    };
    super('users', Schema, dbConnection);
  }
}

module.exports = UsersCollection;