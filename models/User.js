const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Task', UserSchema);