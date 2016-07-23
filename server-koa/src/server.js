
'use strict';

const PORT = process.argv[2];
if (!PORT) {
  throw Error('Server PORT was not passed ... ABORTING'); 
}

const DATABASE_NAME = process.argv[3];
  if (!DATABASE_NAME) {
    throw Error('Database name was not passed ... ABORTING'); 
}

const koa = require('koa'),
      koaBody = require('koa-body'),
      MongoClient = require('mongodb').MongoClient;

const middleware = require('./middleware'),
      routers = require('./routers'), 
      MongoCollection = require('./models/MongoCollection');

const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

// global promise rejection handler
// in case we don't have a catcher in place
// a rejected promise will be handled globaly
process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);
  console.log('ATTENTION. A promise rejection event was cached globaly.');
  console.log('An appropriate error handler might be missing somewhere.');
});

MongoClient.connect(MONGO_URL, function(err, db) {
  if (err) {
    throw Error('DB connection error ... ABORTING');
  }

  console.log(`Connected to MongoDB database '${DATABASE_NAME}' ... OK`);
  
  const app = koa();
  app.use(koaBody({formidable:{uploadDir: __dirname + '/uploads'}}));
  
  // attach DB connection to the app's DA layer class
  MongoCollection.DB = db;

  // plug in all the middleware
  for (let item in middleware) {
    app.use( middleware[item] );
  } 

  // plug in all the routers
  for (let router in routers) {
    app.use( routers[router].routes() );
    app.use( routers[router].allowedMethods() );
  }

  app.listen(PORT, () => console.log(`Listening on ${PORT} ... OK`));
        
}); 
