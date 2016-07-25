
'use strict';

function del(model) {
  return function *(next) {
    try {
      let id = this.params.id;
      let document = yield model.findById(id);
      if (!document) {
        this.status = 404;
      }
      else {
        yield document.remove();
        this.status = 204
      }
    } 
    catch (err) {
      console.log(err);
      this.body = err;
      this.status = 500;
    }
  }
};

module.exports = del;