
'use strict';

const assert = require('assert')

/////////////////////////////////////////////////////////////////////////////
// Class MongoCollection hosts generic logic for DB interaction.
// Using MongoDB native NodeJS driver.
/////////////////////////////////////////////////////////////////////////////

class MongoCollection {
  constructor(collectionName, schema) {
    let database = MongoCollection.DB;

    if (!database) {
      throw Error('Database connection object was not passed to MongoCollection class');
    }
    if (!collectionName) {
      throw Error('Collection name was not passed to MongoCollection instance');
    }
    if (!schema) {
      throw Error('Schema was not passed to MongoCollection instance');
    }

    this.schema = schema;
    this.collection = database.collection(collectionName);
    this.collectionName = collectionName;
  } 

  /////////////////////////////////////////////////////////////////////////////
  // EXPOSABLE
  /////////////////////////////////////////////////////////////////////////////

  save(callback) {
    if (this._id) {
      this._update(callback);
    }
    else {
      this._insert(callback);
    }
  }  

  delete(callback) {
    if (this._id) {
      this._delete(callback);
    }
    else {
      console.log('Can not delete entity that was never saved ... REJECT');
      return;
    }
  }

  getOne(id, callback) {
    if (!callback || typeof(callback) !== 'function') {
      console.log('Callback is not a function of null. Can not perform operation ... REJECT');
      return;
    }
    if (this._id) {
      this._getOne(this._id, callback);
    }
    else {
      console.log('ID was not provided. Can not perform getOne() ... REJECT');
    }
  }

  findAll(query, callback) {
    if (!query) {
      query = {};
    }
    if (!callback || typeof(callback) !== 'function') {
      console.log('Callback is not a function of null. Can not perform operation ... REJECT');
    }
    this._findAll(query, callback);
  }

  /////////////////////////////////////////////////////////////////////////////
  // IMPLEMENTATION
  /////////////////////////////////////////////////////////////////////////////

  _validate() {
    function strip(instance) {
      let plain = {};
      for (let field in instance.schema) {
        plain[field] = instance[field];
      }
      return plain;
    }

    let data = strip(this);    
    let errors = [];

    for (let field in this.schema) {
      let fieldRules = this.schema[field];
      for (let rule of fieldRules) {
        if (!rule.valid(data[field])) {
          errors.push(rule.error);
        }
      }
    }

    if(errors.length > 0) {
      return { errors: errors, data: null };
    }
    else return { errors: null, data: data };
  }

  /////////////////////////////////////////////////////////////////////////////

  _insert(callback) {
    let validationResult = this._validate();
    if ( !validationResult.errors ) {
      let date = validationResult.data;
      this.collection.insertOne(data, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        
        console.log(`Inserted document into the ${this.collectionName} collection ... OK`);
        
        if (callback) {
          callback(result);
        }

      });
    }
    else {
      for (let error of validationResult.errors) {
        console.log(`INVALID DATA -> Reason: ${error} ... VALIDATION ERROR`);
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  _update(callback) {
    let validationResult = this.validate();
    if ( !validationResult.errors ) {
      let date = validationResult.data;
      this.collection.updateOne({ _id: data._id }, { $set: data }, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        
        console.log(`Inserted document into the ${this.collectionName} collection ... OK`);
        
        if (callback) {
          callback(result);
        }

      });
    }
    else {
      for (let error of validationResult.errors) {
        console.log(`INVALID DATA -> Reason: ${error} ... VALIDATION ERROR`);
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  _delete(callback) {
    throw Error('NOT IMPLEMENTED');
  }

  _getOne(id) {
    throw Error('NOT IMPLEMENTED');
  }

  _findAll(query) {
    throw Error('NOT IMPELEMENTED');
  }
}

module.exports = MongoCollection;
