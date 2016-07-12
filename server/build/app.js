'use strict';

var _throw = function _throw(e) {
  throw e;
};

var express, mongoose, bodyParser, morgan, app, server, port, mongooseConnection, taskSchema, TaskModel, typeSchema, TypeModel, typesGET, typesPOST, typesPUT, typesDELETE, tasksGET, tasksPOST, tasksPUT, tasksDELETE;

///////////////////////////////////////////////////////////////////////////////

port = process.argv[2] || _throw(Error('No port number was passed.. Aborting..'));

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
  type: {
    type: mongoose.Schema.ObjectId,
    ref: 'Type'
  },
  room: Number,
  comment: String,
  executionDate: Date
});

TypeModel = mongooseConnection.model('Type', typeSchema);
TaskModel = mongooseConnection.model('Task', taskSchema);

///////////////////////////////////////////////////////////////////////////////
// TASK TYPE ASDASD
///////////////////////////////////////////////////////////////////////////////

typesGET = function typesGET(req, res) {
  TypeModel.find({}, function (e, list) {
    return e ? _throw(Error(e)) : res.send(list);
  });
};

typesPOST = function typesPOST(req, res) {
  var newType = new TypeModel();
  if (!req.body.name) {
    res.status(400).send({ 'error': 'Name is required.' });
    return;
  }
  newType.name = req.body.name;
  newType.save(function (e) {
    return e ? _throw(Error(e)) : res.status(201).send(newType);
  });
};

typesPUT = function typesPUT(req, res) {
  if (!req.body._id) {
    res.status(400).send({ 'error': 'No _id provided.' });
    return;
  }
  if (!req.body._id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).send({ 'error': 'Invalid _id format.' });
    return;
  }
  TypeModel.findOne({ _id: req.body._id }, function (e, entity) {
    if (e) {
      _throw(Error(e));
    }
    if (!entity) {
      res.status(404).send({ 'error': 'Object not found.' });
      return;
    }
    entity.name = req.body.name || entity.name;
    entity.save(function (e) {
      return e ? _throw(Error(e)) : res.status(200).send(entity);
    });
  });
};

typesDELETE = function typesDELETE(req, res) {
  if (!req.body._id) {
    res.status(400).send({ 'error': 'No _id provided.' });
    return;
  }
  if (!req.body._id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).send({ 'error': 'Invalid _id format.' });
    return;
  }
  TypeModel.count({ _id: req.body._id }, function (err, count) {
    if (count > 0) {
      TypeModel.remove({ _id: req.body._id }, function (e) {
        return e ? _throw(Error(e)) : res.status(204).send({ 'data': 'Deleted.' });
      });
    } else {
      res.status(404).send({ 'error': 'Object not found.' });
    }
  });
};

///////////////////////////////////////////////////////////////////////////////
// TASK
///////////////////////////////////////////////////////////////////////////////

tasksGET = function tasksGET(req, res) {
  TaskModel.find({}, function (e, list) {
    return e ? _throw(Error(e)) : res.send(list);
  });
};

tasksPOST = function tasksPOST(req, res) {
  var newTask = new TaskModel();
  var _req$body = req.body;
  var type = _req$body.type;
  var room = _req$body.room;
  var comment = _req$body.comment;

  var input = { 'type': type, 'room': room, 'comment': comment };

  var error = [];
  for (var prop in input) {
    if (!input[prop]) {
      error.push(prop + ' is required.');
    }
  }

  if (error.length) {
    res.status(400).send(error);
    return;
  }

  newTask.type = type;
  newTask.comment = comment;
  newTask.room = room;
  newTask.save(function (e) {
    return e ? _throw(Error(e)) : res.status(201).send(newTask);
  });
};

tasksPUT = function tasksPUT(req, res) {
  if (!req.body._id) {
    res.status(400).send({ 'error': 'No _id provided.' });
    return;
  }

  if (!req.body._id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).send({ 'error': 'Invalid _id format.' });
    return;
  }

  TaskModel.findOne({ _id: req.body._id }, function (e, entity) {
    if (e) {
      _throw(Error(e));
    }
    if (!entity) {
      res.status(404).send({ 'error': 'Object not found.' });
      return;
    }

    entity.name = req.body.name || entity.name;
    entity.type = req.body.type || entity.type;
    entity.comment = req.body.comment || entity.comment;
    entity.room = req.body.room || entity.room;

    entity.save(function (e) {
      return e ? _throw(Error(e)) : res.status(200).send(entity);
    });
  });
};

tasksDELETE = function tasksDELETE(req, res) {
  if (!req.body._id) {
    res.status(400).send({ 'error': 'No _id provided.' });
    return;
  }
  if (!req.body._id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).send({ 'error': 'Invalid _id format.' });
    return;
  }
  TaskModel.count({ _id: req.body._id }, function (err, count) {
    if (count > 0) {
      TaskModel.remove({ _id: req.body._id }, function (e) {
        return e ? _throw(Error(e)) : res.status(204).send({ 'data': 'Deleted.' });
      });
    } else {
      res.status(404).send({ 'error': 'Object not found.' });
    }
  });
};

///////////////////////////////////////////////////////////////////////////////

app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.route('/api/types').get(typesGET).post(typesPOST).put(typesPUT).delete(typesDELETE);

app.route('/api/tasks').get(tasksGET).post(tasksPOST).put(tasksPUT).delete(tasksDELETE);

///////////////////////////////////////////////////////////////////////////////

server = app.listen(port, function (e) {
  if (e) {
    throw Error(e.toString());
  }
  console.log('Listening on ' + port + '..');
});