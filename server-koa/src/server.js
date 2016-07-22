
'use strict';

const PORT = process.argv[2];
if (!PORT) {
  throw Error('Server PORT was not passed ... ABORTING'); 
}

const DATABASE_NAME = process.argv[3];
  if (!DATABASE_NAME) {
    throw Error('Database name was not passed ... ABORTING'); 
}

const koa = require('koa');
const MongoClient = require('mongodb').MongoClient;

const middleware = require('./middleware');
const routers = require('./routers');
const User = require('./models/User');
const MongoCollection = require('./models/MongoCollection');

const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

MongoClient.connect(MONGO_URL, function(err, db) {
  if (err) {
    throw Error('DB connection error ... ABORTING');
  }

  console.log(`Connected to MongoDB database '${DATABASE_NAME}' ... OK`);
  
  const app = koa();
  
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

  let u = new User();
  u.username = 'asasdasdasd';
  u.save();
  
});
