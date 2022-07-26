const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
    unique: true,
    ref: 'User'
  },
  // like from me -> user
  lastLikeSent: {
    type: Date,
    default: Date.now()
  },
  likeSentToday: {
    type: Number,
    default: 0
  },
  likeSentWeek: {
    type: Number,
    default: 0
  },
  likeSentMonth: {
    type: Number,
    default: 0
  },
  // like from user -> me
  lastReceivedLike: {
    type: Date,
    default: Date.now()
  },
  likeReceivedToday: {
    type: Number,
    default: 0
  },
  likeReceivedWeek: {
    type: Number,
    default: 0
  },
  likeReceivedMonth: {
    type: Number,
    default: 0
  },
});

module.exports = mongoose.model('Stat', statSchema);