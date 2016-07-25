
'use strict';

function post(model) {
  return function *(next) {
    try {
      let entity = new model(this.request.body);
      yield entity.save();
      this.status = 201;
    } 
    catch (err) {
      console.log(err);
      this.body = err;
      this.status = 500;
    }
  }
};

module.exports = post;