
'use strict';

function getAll(model) {
  return function *(next) {
    try { 
      this.body = yield model.find({}); 
    } 
    catch (err) {
      console.error(err);
      this.status = 500;
    }
  }
};

module.exports = getAll;