let db = null
const mongoose = require('mongoose');
mongoose.connection.on('open', function() {
  console.log('[+] MongoDB connected successfully');
});
mongoose.connection.on('close', function() {
  console.log('[+] MongoDB disconnected successfully');
});
mongoose.connection.on('error', function(error) {
  console.error('[x] MongoDB error.');
  throw error
});
const connect = (url) => {
  if(!!url === false) throw new Error('Database undefined.')
  db = mongoose.connect(url);
  return db
}

const User = require('./models/User.js');
const Notification = require('./models/Notification.js');
const Stat = require('./models/Stat.js')
const Config = require('./models/Config.js')

module.exports = { db, connect, User, Notification, Stat, Config }