
'use strict';

function post(model) {
  return function *(next) {
    try {
      let entity = new model(this.request.body);
      yield entity.save();
      this.status = 201;
    } 
    catch (err) {
      console.error(err);
      if (err.name === 'ValidationError') {
        this.body = err.errors;
        this.status = 400;
      }
      else {
        console.error(err);
        this.status = 500;
      }
    }
  }
};

module.exports = post;