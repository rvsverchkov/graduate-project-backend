const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    type: String
  },
  time: {
    type: String
  },
  questions: {
    type: Array,
  },
  users: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('test', testSchema);
