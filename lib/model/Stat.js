const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // like from user -> me
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
  // like from me -> user
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