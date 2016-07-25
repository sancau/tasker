
'use strict';

function getOne(model) {
  return function *(next) {
    try { 
      this.body = yield model.findById(this.params.id); 
    } 
    catch (err) {
      console.log(err);
      this.body = err;
      this.status = 500;
    }
  }
};

module.exports = getOne;