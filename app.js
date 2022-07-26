require('dotenv').config()

/** load db for later use */
const { connect } = require('./src/db.js')
connect(process.env['MONGO_URI'])

const { Anilist } = require('./src/Anilist.js')
const anilist = new Anilist(process.env['ANILIST_TOKEN'])
anilist.resetNotificationCount = false

const { runCron } = require('./src/cron.js')
runCron(anilist)

const { server } = require('./src/webserver.js')
server.listen(3000, () => {
  console.log(`> Running on localhost:3000`);
});
