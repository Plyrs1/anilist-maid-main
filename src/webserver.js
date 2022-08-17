const { cronToHumanTime } = require('./utils.js')
const { config } = require('../config.js')
const { reportLikeCount } = require('./Report.js')
const { getDailyRank, getWeeklyRank, getMonthlyRank } = require('./BannerGen.js')
const serve = require('serve-static')('./src/static');
const polka = require('polka'); 
const server = polka()

.use('/update', async (req, res, next) => {
  if(req.params.key !== config.refreshKey) {
    res.end("ok")
    return
  }
  if(!await reportLikeCount()) {
    res.end('reportLikeCount failed')
    return
  }
  next()
})
.get('/update/daily/:key', async (req, res) => {
  if(!await getDailyRank()){
    res.end('getDailyRank failed')
    return
  }
  res.end(`<html><meta http-equiv="refresh" content="0;url=/leaderboard-day.png" /></html>`)
})
.get('/update/weekly/:key', async (req, res) => {
  if(!await getWeeklyRank()){
    res.end('getWeeklyRank failed')
    return
  }
  res.end(`<html><meta http-equiv="refresh" content="0;url=/leaderboard-week.png" /></html>`)
})
.get('/update/monthly/:key', async (req, res) => {
  if(!await getMonthlyRank()){
    res.end('getMonthlyRank failed')
    return
  }
  res.end(`<html><meta http-equiv="refresh" content="0;url=/leaderboard-month.png" /></html>`)
})
.get('/next', async (req, res) => {
  res.end(JSON.stringify(cronToHumanTime(config.cronSchedule)))
})
.use(serve)
.get('*', (req, res) => {
  res.end('ok')
})

module.exports = { server }
