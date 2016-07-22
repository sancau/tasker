
'use strict';

const koaRouter = require('koa-router');
const UserCollection = require('../models/UserCollection.js');

const router = koaRouter();

const URL = '/';

function *get(next) {
  let collection = new UserCollection();
  let users = yield collection.findAll();
  this.body = users;
}

function *post(next) {
  
}

router.get(URL, get);
router.post(URL, post);

module.exports = router;
