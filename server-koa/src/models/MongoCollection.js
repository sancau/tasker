
'use strict';

const assert = require('assert')

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

  validate() {
    function strip(instance) {
      let plain = {};
      for (let field in instance.schema) {
        plain[field] = instance[field];
      }
      return plain;
    }

    let data = strip(this);    
    let errors = [];

    // DO IT WITH MAP/FILTER | TODO ..dat is ugly :)

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

  insert(callback) {
    let validationResult = this.validate();
    if ( !validationResult.errors ) {
      if (validationResult.data._id) {
        console.log('INVALID OPERATION -> Can not insert an entity that is already in DB ... REJECT');
        return;
      }

      this.collection.insertOne(validationResult.data, (err, result) => {
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

  insertMany(dataArray, callback) {
    
    // TODO VALIDATION 

    this.collection.insertMany(dataArray, (err, result) => {
      assert.equal(err, null)
      assert.equal(dataArray.length, result.result.n);
      assert.equal(dataArray.length, result.ops.length);   

      console.log(`Inserted ${dataArray.length} documents into the ${this.collectionName} collection ... OK`);

      if (callback) {
        callback(result);
      }

    });
  }
}

module.exports = MongoCollection;
