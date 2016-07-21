
'use strict';

const assert = require('assert')

class MongoCollection {
  constructor(db, collectionName) {
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);
  } 

  insert(data, callback) {
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

  insertMany(dataArray, callback) {
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