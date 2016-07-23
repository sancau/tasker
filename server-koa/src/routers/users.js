
'use strict';

const koaRouter = require('koa-router');
const UsersCollection = require('../models/UsersCollection.js');

const router = koaRouter();
const URL = '/users';

/////////////////////////////////////////////////////////////////////////////

function *getAll(next) {
  try {
    let collection = new UsersCollection();
    let users = yield collection.findAll();  
    this.body = users;
  } catch (err) {
    console.log(err);
    this.body = err;
    this.status = 500;
  }
}

/////////////////////////////////////////////////////////////////////////////

function *post(next) {
  try {
    let data = this.request.body;
    let collection = new UsersCollection();
    yield collection.insert(data);
    this.status = 201
  } catch (err) {
    console.log(err);
    if (err.validationErrors) {
      this.body = err.validationErrors;
      this.status = 400;
    } else {
      this.status = 500;
    }
  }
}

/////////////////////////////////////////////////////////////////////////////

function *getOne(next) {
  try {
    let id = this.params.id;
    let collection = new UsersCollection();
    let user = yield collection.getByID(id);
    if (user) {
      this.body = user;
    }
    else {
      this.status = 404;
    }
  } catch (err) {
    console.log(err);
    this.body = err;
    this.status = 500;
  }
}

/////////////////////////////////////////////////////////////////////////////

function *put(next) {
  try {
    let id = this.params.id;
    let data = this.request.body;
    let collection = new UsersCollection();
    let user = yield collection.getByID(id);
    if (user) {
      yield collection.update(user._id, data);
      this.status = 200;
    }
    else {
      this.status = 404;
    }
  } catch (err) {
    console.log(err);
    if (err.validationErrors) {
      this.body = err.validationErrors;
      this.status = 400;
    } else {
      this.status = 500;
    }
  }
}

/////////////////////////////////////////////////////////////////////////////

function *del(next) {
  try {
    let id = this.params.id;
    let collection = new UsersCollection();
    let user = yield collection.getByID(id);
    if (user) {
      yield collection.remove(id);
      this.status = 204
    } else {
      this.status = 404;
    }
  } catch (err) {
    console.log(err);
    this.body = err;
    this.status = 500;
  }
}

/////////////////////////////////////////////////////////////////////////////

router.get(URL, getAll);
router.post(URL, post);

router.get(`${URL}/:id`, getOne);
router.put(`${URL}/:id`, put);
router.del(`${URL}/:id`, del);

module.exports = router;
