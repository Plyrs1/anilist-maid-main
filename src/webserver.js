const { nextRun } = require('./cron.js')

const polka = require('polka'); 
const server = polka()

.get('/next', async (req, res) => {
  res.end(JSON.stringify(nextRun()))
})
.get('*', (req, res) => {
  res.end('ok')
})

module.exports = { server }