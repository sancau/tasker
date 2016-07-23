
'use strict';

const koaRouter = require('koa-router');
const CategoriesCollection = require('../models/CategoriesCollection.js');

const router = koaRouter();
const URL = '/categories';

/////////////////////////////////////////////////////////////////////////////

function *getAll(next) {
  try {
    let collection = new CategoriesCollection();
    let entities = yield collection.findAll();  
    this.body = entities;
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
    let collection = new CategoriesCollection();
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
    let collection = new CategoriesCollection();
    let entity = yield collection.getByID(id);
    if (entity) {
      this.body = entity;
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
    let collection = new CategoriesCollection();
    let entity = yield collection.getByID(id);
    if (entity) {
      yield collection.update(entity._id, data);
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
    let collection = new CategoriesCollection();
    let entity = yield collection.getByID(id);
    if (entity) {
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
