
'use strict';

const mongoose = require('mongoose');

let typeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = {
  model: mongoose.model('type', typeSchema)
};
 