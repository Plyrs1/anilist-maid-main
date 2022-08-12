const { nextRun } = require('./cron.js')

const serve = require('serve-static')('./src/static');
const polka = require('polka'); 
const server = polka()

.get('/next', async (req, res) => {
  res.end(JSON.stringify(nextRun()))
})
.use(serve)
.get('*', (req, res) => {
  res.end('ok')
})

module.exports = { server }