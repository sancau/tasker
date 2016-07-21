
'use strict';

const koaRouter = require('koa-router');
const router = koaRouter();
const URL = '/';

function *get(next) {
  this.body = `<h1> GET ${URL} </h1>`
}

function *post(next) {
  this.body = `<h1> POST ${URL} </h1>`
}

router.get(URL, get);
router.post(URL, post);

module.exports = router;
