require('dotenv').config()

const { config } = require('./config.js')
/** load db for later use */
const { connect } = require('./src/db.js')
connect(config.mongoUri)

const { Anilist } = require('./src/Anilist.js')
const anilist = new Anilist(config.anilistToken)
anilist.resetNotificationCount = false

const { runCron } = require('./src/cron.js')
runCron(anilist)

const { server } = require('./src/webserver.js')
server.listen(3000, () => {
  console.log(`> Running on localhost:3000`);
});
