
const mongoose = require('mongoose');
const url = process.env['MONGO_URI'] || null;
if(!!url === false) throw Error('Database undefined.')
db = mongoose.connect(url);
const User = require('./models/User.js');
const Notification = require('./models/Notification.js');
const Stat = require('./models/Stat.js')
const Config = require('./models/Config.js')
module.exports = { db, User, Notification, Stat, Config }