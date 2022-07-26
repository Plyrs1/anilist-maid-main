const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Config', configSchema);