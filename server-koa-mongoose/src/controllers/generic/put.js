
'use strict';

function put(model) {
  return function *(next) {
    try {
      let id = this.params.id;
      let data = this.request.body;
      let document = yield model.findById(id);
      if (document) {
        for (let key in data) {
          document[key] = data[key];
        }
        yield document.save();
        this.status = 200;
      }
      else {
        this.status = 404;
      }
    } 
    catch (err) {
      console.log(err);
      this.body = err;
      this.status = 500;
    }
  }
};

module.exports = put;