const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
    ref: 'User'
  },
  activityId: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['ACTIVITY_MESSAGE', 'ACTIVITY_LIKE', 'ACTIVITY_MENTION','ACTIVITY_REPLY','ACTIVITY_REPLY_SUBSCRIBED','FOLLOWING'],
    default: 'ACTIVITY_LIKE'
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Notification', notificationSchema);