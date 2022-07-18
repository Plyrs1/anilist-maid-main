const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: String,
    required: true,
  },
  // set to true if user likes / send us messages
  hasInteracted: {
    type: Boolean,
    default: false
  },
  // set to true if we already liked their activity
  // reset to false every x minutes in cron
  hasLiked: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('User', userSchema);