
'use strict';

const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;

/////////////////////////////////////////////////////////////////////////////
// MongoCollection hosts generic logic for DB interaction.
// Using MongoDB native NodeJS driver and Bluebird.
/////////////////////////////////////////////////////////////////////////////

class MongoCollection {
  constructor(collectionName, schema, dbConnection) {
    let database = dbConnection || MongoCollection.DB;

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

  _strip(data) {
    let plain = {};
    for (let field in this.schema) {
      if (data[field] != null) {
        plain[field] = data[field];
      }
    }
    return plain;
  }
  
  _validateGeneric(data, fieldSet) {
    data = this._strip(data);    
    let errors = [];
    for (let field in fieldSet) {
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
  
  _validateInsert(data) {
    let fieldSet = this.schema;
    return this._validateGeneric(data, fieldSet);
  }
  
  _validateUpdate(data) {
    let fieldSet = data;
    return this._validateGeneric(data, fieldSet);
  }

  
  /////////////////////////////////////////////////////////////////////////////
  // EXPOSABLE ('INTERFACE')
  /////////////////////////////////////////////////////////////////////////////
  
  insert(data) {
    return new Promise((resolve, reject) => {
      let validationResult = this._validateInsert(data);
      if ( !validationResult.errors ) {
        let document = validationResult.data;
        resolve(this.collection.insertOne(document));
      }
      else reject({
        validationErrors: validationResult.errors
      });
    });
  }  

  update(id, data) {
    return new Promise((resolve, reject) => {
      let validationResult = this._validateUpdate(data);
      if ( !validationResult.errors ) {
        let document = validationResult.data;
        resolve(this.collection.updateOne(
          {_id: ObjectID(id)}, {$set: document}));
      }
      else reject({
        validationErrors: validationResult.errors
      });
    });
  }

  remove(id) {
    return this.collection.remove({ _id: ObjectID(id) });
  }

  getByID(id) {
    return this.collection.findOne({ _id: ObjectID(id) });
  }

  findAll(query) {
    return this.collection.find(query).toArray();
  }
}


module.exports = MongoCollection;
