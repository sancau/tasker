
'use strict';

const MongoCollection = require('./MongoCollection');

class User extends MongoCollection {
  constructor(db) {
    super(db, 'users');
  }

  valid(data) {
    return true; // TODO
  }

  insert(data) {
    if ( this.valid(data) ) {
      super.insert(data);
    }
    else {
      console.log('DATA INVALID');
    }
  }
}

module.exports = User;