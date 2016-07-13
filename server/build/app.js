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
  room: String,
  comment: String,
  executionDate: Date,
  isConfirmed: Boolean
});

TypeModel = mongooseConnection.model('Type', typeSchema);
TaskModel = mongooseConnection.model('Task', taskSchema);

///////////////////////////////////////////////////////////////////////////////
// TYPE
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

  // Appending relative object to response
  function handleList(list, cb) {
    var processedList = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        (function (item) {
          TypeModel.findOne({ _id: item.type }, function (e, entity) {
            if (e) {
              _throw(Error(e));
            }
            if (!entity) {
              console.error('No entity.');
              return;
            }
            item.type = entity;
            processedList.push(item);
            if (processedList.length === list.length) {
              cb(processedList);
            }
          });
        })(item);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  TaskModel.find({}, function (e, list) {
    return e ? _throw(Error(e)) : handleList(list, function (processed) {
      return res.send(processed);
    });
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

  if (!req.body.type.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).send({ 'error': 'Invalid _id format.' });
    return;
  }

  newTask.type = type;
  newTask.comment = comment;
  newTask.room = room;
  newTask.executionDate = new Date();
  newTask.isConfirmed = false;
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
    entity.isConfirmed = req.body.isConfirmed || entity.isConfirmed;
    entity.save(function (e) {
      return e ? _throw(Error(e)) : res.status(200).send(entity);
    });
  });
};

tasksDELETE = function tasksDELETE(req, res) {
  console.log(req.body);
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
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.route('/api/types').get(typesGET).post(typesPOST).put(typesPUT).delete(typesDELETE);

app.route('/api/tasks').get(tasksGET).post(tasksPOST).put(tasksPUT).delete(tasksDELETE);

app.get('/', function (req, res) {
  res.render('index');
});

///////////////////////////////////////////////////////////////////////////////

server = app.listen(port, function (e) {
  if (e) {
    throw Error(e.toString());
  }
  console.log('Listening on ' + port + '..');
});