
'use strict';

module.exports = function* xResponseTime(next) {
  if (!this.state.start) {
    this.state.start = new Date;
  } 
  yield next;
  var ms = new Date - this.state.start;
  this.set('X-Response-Time', `${ms} ms`);
}