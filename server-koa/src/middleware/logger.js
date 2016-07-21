
'use strict';

const assert = require('assert');

module.exports = function* Logger(next) {
  if (!this.state.start) {
    this.state.start = new Date;
  }

  var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the document collection");
      if (callback) {
        callback(result);
      }
    });
  }

  let db = this.app.context.db;

  insertDocuments(db);

  yield next;
  var ms = new Date - this.state.start;
  console.log(`[${this.method}] responded [${this.status}] in ${ms} ms from url ${this.url}`);
}