
'use strict';

const MongoCollection = require('./MongoCollection');

class User extends MongoCollection {
  constructor() {
    const excludeFields = []; 
    super('users', excludeFields);
  }

  validate() {
    if(!this.username) {
      return { valid: false, error: 'Username is required.'}
    }
    else return { valid: true, error: null };
  }
  
  static getOne() {
    throw Error('NOT IMPLEMENTED');
  }
  
  static getMany() {
    throw Error('NOT IMPLEMENTED');
  }

  insert() {
    if (this.id) {
      console.log('User | INVALID OPERATION -> Can not insert a user that is already in DB ... REJECT');
      return;
    }

    let validationResult = this.validate();
    if ( validationResult.valid ) {
      super.insert(data);
    }
    else {
      console.log(`User | INVALID DATA -> Reason: ${validationResult.error} ... VALIDATION ERROR`);
    }
  }
  
  update(data) {
    throw Error('NOT IMPLEMENTED');
  }
  
  delete() {
    throw Error('NOT IMPLEMENTED');
  }
}

module.exports = User;