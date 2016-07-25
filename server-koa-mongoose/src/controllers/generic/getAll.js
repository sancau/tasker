
'use strict';

function getAll(model) {
  return function *(next) {
    try { 
      this.body = yield model.find({}); 
    } 
    catch (err) {
      console.log(err);
      this.body = err;
      this.status = 500;
    }
  }
};

module.exports = getAll;