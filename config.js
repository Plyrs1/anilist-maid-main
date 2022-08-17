const cronSchedule = {
  getUpdate: '9 * * * *',           // every hour at minute 9 
  reportLikeCount: '10 * * * *',    // every hour at minute 10
  reportClearDaily: '13 0 * * *',   // every day at 0:13
  reportClearWeekly: '17 0 * * 1',  // every monday at 0:17
  reportClearMonthly: '21 0 1 * *', // every first day of the month at 0:21
}
const mongoUri = process.env['MONGO_URI']
const anilistToken = process.env['ANILIST_TOKEN']
const refreshKey = process.env['REFRESH_KEY']
const config = { cronSchedule, mongoUri, anilistToken, refreshKey }
module.exports = { config }
