
'use strict';

const koaRouter = require('koa-router');
const User = require('../models/User.js');

const router = koaRouter();

const URL = '/';

function *get(next) {
  let users = yield User.findAll();
  this.body = users;
}

function *post(next) {
  
}

router.get(URL, get);
router.post(URL, post);

module.exports = router;
