////// <reference path="../typings/index.d.ts" />

'use strict';

var _throw = function(e: Error): void { throw e };

var express, 
    mongoose,
    bodyParser,
    morgan,
    
    app, 
    server, 
    port, 
    mongooseConnection,
    
    taskSchema,
    TaskModel,
    typeSchema,
    TypeModel,
    
    typesGET, 
    typesPOST,
    typesPUT,
    typesDELETE,
    
    tasksGET,
    tasksPOST,
    tasksPUT,
    tasksDELETE;

///////////////////////////////////////////////////////////////////////////////

port = 
  process.argv[2] || _throw(Error('No port number was passed.. Aborting..'));

express = require('express');
mongoose = require('mongoose');
bodyParser = require('body-parser');
morgan = require('morgan');

///////////////////////////////////////////////////////////////////////////////

mongooseConnection = mongoose.createConnection('mongodb://localhost/tasker');

typeSchema = new mongoose.Schema({
  name: String 
});

taskSchema = new mongoose.Schema({
  type: mongoose.Schema.ObjectId,
  executionDate: Date,
  room: Number,
  comment: String
});

TypeModel = mongooseConnection.model('Type', typeSchema);
TaskModel = mongooseConnection.model('Task', taskSchema);

///////////////////////////////////////////////////////////////////////////////
// TASK TYPE
///////////////////////////////////////////////////////////////////////////////

interface MongooseEntity {
  save(e: Function): void;
}

interface TaskType extends MongooseEntity {
  _id?: string;
  name: string;
}

typesGET = function(req, res) {
  TypeModel.find({}, (e, list) => e ? _throw(Error(e)) : res.send(list)); 
};

typesPOST = function(req, res) {
  let newType = new TypeModel();
  if (!req.body.name) {
        res.status(400).send({'error' : 'Name is required.'});
        return;
  }
  newType.name = req.body.name;
  newType.save((e) => e ? _throw(Error(e)) : res.status(201).send(newType));
};

typesPUT = function(req, res) {
  if (!req.body._id) { 
    res.status(400).send({'error':'No _id provided.'}); 
    return; 
  }
  TypeModel.findOne({_id: req.body._id}, function(e, entity: TaskType) {
    if (e) { _throw(Error(e)) }
    if (!entity) { 
      res.status(404).send({'error': 'Object not found.'}); 
      return;
    }

    entity.name = req.body.name || entity.name;
    entity.save((e) => e ? _throw(Error(e)) : res.status(200).send(entity));
  });
};

typesDELETE = function(req, res) {
  if (!req.body._id) { res.status(404).send({'error': 'No _id provided.'}); }
  else {
    TypeModel.count({ _id: req.body._id }, function (err, count){ 
      if (count > 0) {
        TypeModel.remove(
          { _id: req.body._id }, 
          (e) => 
            e ? _throw(Error(e)) : res.status(204).send({'data': 'Deleted.'})
        );    
      }
      else {
        res.status(404).send({'error': 'Object not found.'});
      }
    });
  }
};

///////////////////////////////////////////////////////////////////////////////
// TASK
///////////////////////////////////////////////////////////////////////////////

// tasksGET = function(req, res) {};
// tasksPOST = function(req, res) {};
// tasksPUT = function(req, res) {};
// tasksDELETE = function(req, res) {};

///////////////////////////////////////////////////////////////////////////////

app = express();  
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.route('/types')
  .get(typesGET)
  .post(typesPOST)
  .put(typesPUT)
  .delete(typesDELETE)

// app.route('/tasks')
//   .get(tasksGET)
//   .post(tasksPOST)
//   .put(tasksPUT)
//   .delete(tasksDELETE);

///////////////////////////////////////////////////////////////////////////////

server = app.listen(port, function(e) {
  if (e) {
    throw Error(e.toString());
  }
  console.log('Listening on ' + port + '..');
});
