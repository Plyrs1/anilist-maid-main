const { cronToHumanTime } = require('./utils.js')
const { config } = require('../config.js')
const serve = require('serve-static')('./src/static');
const polka = require('polka'); 
const server = polka()

.get('/next', async (req, res) => {
  res.end(JSON.stringify(cronToHumanTime(config.cronSchedule)))
})
.use(serve)
.get('*', (req, res) => {
  res.end('ok')
})

module.exports = { server }
