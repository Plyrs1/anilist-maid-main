const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  activityId: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['LIKE', 'MESSAGE', 'REPLY'],
    default: 'LIKE'
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Notification', notificationSchema);