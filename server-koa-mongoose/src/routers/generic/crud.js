
'use strict';

const koaRouter = require('koa-router');
const controllers = require('../../controllers')

const router = koaRouter();

function genericRouter(url, model) {
  const router = koaRouter();
  router.get(url, controllers.generic.getAll(model));
  router.post(url, controllers.generic.post(model));
  router.get(`${url}/:id`, controllers.generic.getOne(model));
  router.put(`${url}/:id`, controllers.generic.put(model));
  router.del(`${url}/:id`, controllers.generic.del(model));
  return router;
}

module.exports = genericRouter;