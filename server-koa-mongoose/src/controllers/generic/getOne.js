
'use strict';

function getOne(model) {
  return function *(next) {
    try { 
      this.body = yield model.findById(this.params.id); 
    } 
    catch (err) {
      console.error(err);
      this.status = 500;
    }
  }
};

module.exports = getOne;