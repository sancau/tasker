
'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let taskSchema = new Schema({
  type: { type: Schema.Types.ObjectId, ref: 'taskgroup', required: true },
  room: String,
  comment: String,
  executionDate: { type: Date, required: true, default: Date.now },
  isConfirmed: { type: Boolean, required: true, default: false }
});

module.exports = {
  model: mongoose.model('task', taskSchema),
  populate: ['type']
};
 