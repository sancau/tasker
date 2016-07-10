'use strict';

var express, 
    mongoose,
    bodyParser,
    
    app, 
    server, 
    port, 
    mongooseConnection,
    
    task, // mongoose schema
    taskModel, // mongoose model
    type, // mongoose schema
    typeModel, // mongoose model   
    
    typesGET, 
    typesPOST,
    typesPUT,
    typesDELETE,
    
    tasksGET,
    tasksPOST,
    tasksPUT,
    tasksDELETE;

express = require('express');
mongoose = require('mongoose');
bodyParser = require('body-parser');

port = process.argv[2] ||
  (function() { throw Error('Port was not defined. Exiting.')})();

mongooseConnection = mongoose.createConnection('mongodb://localhost/tasker');

type = new mongoose.Schema({
  name: String 
});

task = new mongoose.Schema({
  type: mongoose.Schema.ObjectId,
  executionDate: Date,
  room: Number,
  comment: String
});

typeModel = mongooseConnection.model('Type', type);
taskModel = mongooseConnection.model('Task', task);

typesGET = function(req, res, next){
  typeModel.find({}, function(e, types){
    if (e) {
      throw Error(e);
    }
    res.send(types);
    // TODO paging
  });
};
typesPOST = function(req, res, next){
  newType = new typeModel();
  newType.name = req.body.name;
  newType.save();
  res.sendStatus(201);
};
typesPUT = function(req, res, next){};
typesDELETE = function(req, res, next){};

tasksGET = function(req, res, next){};
tasksPOST = function(req, res, next){};
tasksPUT = function(req, res, next){};
tasksDELETE = function(req, res, next){};

app = express();  
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.route('/tasks')
  .get(tasksGET)
  .post(tasksPOST)
  .put(tasksPUT)
  .delete(tasksDELETE);

app.route('/types')
  .get(typesGET)
  .post(typesPOST)
  .put(typesPUT)
  .delete(typesDELETE)

server = app.listen(port, function(e) {
  if (e) {
    throw Error(e.toString());
  }
  console.log('Listening on ' + port + '..');
});

let newType = new typeModel();
newType.name = 'Printer';
newType.save();
