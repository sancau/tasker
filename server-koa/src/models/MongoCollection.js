
'use strict';

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
  } 


  /////////////////////////////////////////////////////////////////////////////
  // INNER IMPLEMENTATION ('PRIVATE')
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

  _insert(data) {
    return new Promise((resolve, reject) => {
      let validationResult = this._validate(data);
      if ( !validationResult.errors ) {
        let document = validationResult.data;
        resolve(this.collection.insertOne(document));
      }
      else reject(validationResult.errors);
    });
  }  

  _update(data) {
    return new Promise((resolve, reject) => {
      let validationResult = this._validate(data);
      if ( !validationResult.errors ) {
        let document = validationResult.data;
        resolve(this.collection.updateOne(
          {_id: ObjectID(document._id)}, {$set: document}));
      }
      else reject(validationResult.errors);
    });
  }
  
  
  /////////////////////////////////////////////////////////////////////////////
  // EXPOSABLE ('INTERFACE')
  /////////////////////////////////////////////////////////////////////////////
  
  save() {
    if (this._id) {
      return this._update(this);
    }
    else {
      return this._insert(this);
    }
  }

  remove(id) {
    return this.collection.remove({ _id: ObjectID(id) });
  }

  static getById(id, collectionName) {
    return MongoCollection
           .DB
           .collection(collectionName)
           .findOne({ _id: ObjectID(id) });
  }

  static findAll(query, collectionName) {
    return MongoCollection
           .DB
           .collection(collectionName)
           .find(query).toArray();
  }
}

module.exports = MongoCollection;
