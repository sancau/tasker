
'use strict';

///////////////////////////////////////////////////////////////////////////////

const PORT = process.argv[2];
if (!PORT) {
  throw Error('Server PORT was not passed ... ABORTING'); 
}

const DATABASE_NAME = process.argv[3];
  if (!DATABASE_NAME) {
    throw Error('Database name was not passed ... ABORTING'); 
}

const MONGO_URL = process.argv[4] || 
                  `mongodb://localhost:27017/${DATABASE_NAME}`;

const koa = require('koa'),
      koaBody = require('koa-body'),
      mongoose = require('mongoose'),
      bluebird = require('bluebird');

const middleware = require('./middleware'),
      endpoints = require('./endpoints');


///////////////////////////////////////////////////////////////////////////////
// global promise rejection handler
// in case we don't have a catcher in place
// a rejected promise will be handled globaly

process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);
  console.log('ATTENTION. A promise rejection event was cached globaly.');
  console.log('An appropriate error handler might be missing somewhere.');
});


///////////////////////////////////////////////////////////////////////////////

mongoose.Promise = bluebird;
mongoose.connect(MONGO_URL)
.then(
  () => {
    console.log('Database connection estabished ... OK');
    try {
      const app = koa();
      app.use(koaBody({formidable:{uploadDir: __dirname + '/uploads'}}));

      // plug in all the application level middleware
      for (let item in middleware) {
        console.log(`Starting ${item} middleware ... INFO`);
        app.use( middleware[item] );
        console.log(`${item} middleware up and running ... OK`);
      } 

      // plug in all the endpoints
      for (let item in endpoints) {
        console.log(`Starting ${item} endpoint ... INFO`);
        let endpoint = endpoints[item];
        let router = endpoint.router(endpoint.url, endpoint.model);
        app.use(router.routes());
        app.use(router.allowedMethods());
        console.log(`Endpoint ${endpoint.url} up and running ... OK`);
      }
      app.listen(PORT, () => console.log(`Listening on port ${PORT} ... OK`));
    } 
    catch (err) {
      console.error(`${err} ... ERROR`);
    }
  },
  (err) => console.error(`Connection error: ${err.message} ... ERROR`)
);
