
'use strict';

const mongoose = require('mongoose');

let taskgroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = {
  model: mongoose.model('taskgroup', taskgroupSchema)
};
 