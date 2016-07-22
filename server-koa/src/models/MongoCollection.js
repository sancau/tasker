
'use strict';

const assert = require('assert')
const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;

/////////////////////////////////////////////////////////////////////////////
// MongoCollection hosts generic logic for DB interaction.
// Using MongoDB native NodeJS driver and Bluebird.
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
  // EXPOSABLE ('INTERFACE')
  /////////////////////////////////////////////////////////////////////////////

  insert(data) {
    return this._insert(data);
  }  

  update(data) {
    return this._update(data);
  }

  remove(id) {
    return this._remove(id);
  }

  getById(id) {
    return this._getById(id);

  }

  findAll(query) {
    return this._findAll(query);
  }

  /////////////////////////////////////////////////////////////////////////////
  // IMPLEMENTATION ('PRIVATE')
  /////////////////////////////////////////////////////////////////////////////

  _validate(data) {
    function strip(instance) {
      let plain = {};
      for (let field in instance.schema) {
        plain[field] = data[field];
      }
      return plain;
    }

    data = strip(this, data);    
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

  _insert(data) {
    return new Promise((resolve, reject) => {
      let validationResult = this._validate(data);
      if ( !validationResult.errors ) {
        let data = validationResult.data;
        this.collection.insertOne(data, (err, result) => {
          assert.equal(err, null);
          assert.equal(1, result.result.n);
          assert.equal(1, result.ops.length);
          console.log(`Inserted document into the ${this.collectionName} collection ... OK`);
          if (err !== null) return reject(err);
          resolve(result);
        });
      }
      else reject(validationResult.errors);
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  _update(data) {
    return new Promise((resolve, reject) => {
      let validationResult = this._validate(data);
      if ( !validationResult.errors ) {
        let data = validationResult.data;
        this.collection.updateOne({ _id: data._id }, { $set: data }, (err, result) => {
          assert.equal(err, null);
          // assert.equal(1, result.result.n);
          // assert.equal(1, result.ops.length);
          console.log(`Inserted document into the ${this.collectionName} collection ... OK`);
          if (err !== null) return reject(err);
          resolve(result);
        });
      }
      else reject(validationResult.errors);
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  _remove(id) {
    return new Promise((resolve, reject) => {
      this.collection.deleteOne({ _id: id }, (err, result) => {
        assert.equal(err, null);
        // assert.equal(1, result.result.n);
        console.log(`Removed entity with id ${id} from the ${this.collectionName} collection ... OK`);
        if (err !== null) return reject(err);
        resolve(result);
      });
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  _getById(id) {
    return new Promise((resolve, reject) => {
      this.collection
      .findOne({ '_id': new ObjectID(id) }, (err, doc) => {
        if (err !== null) return reject(err);
        resolve(doc);
      });
    }); 
  }
  
  /////////////////////////////////////////////////////////////////////////////

  _findAll(query) {
    return new Promise((resolve, reject) => {
      this.collection
      .find(query)
      .toArray((err, docs) => {
        if (err !== null) return reject(err);
        resolve(docs);
      });
    });
  }
}

module.exports = MongoCollection;
