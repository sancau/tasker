
'use strict';

const mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Category', categorySchema);
