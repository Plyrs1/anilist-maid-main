// const cronSchedule = {
//   getUpdate: '13 * * * *',
//   dailyReport: '0 0 * * *',
//   weeklyReport: '0 1 * * 1',
//   monthlyReport: '0 2 1 * *'
// }


// const startMin = 24
// const cronSchedule = {
//   getUpdate:      `${startMin} * * * *`,
//   dailyReport:    `${startMin+1} * * * *`,
//   getDailyRank:   `${startMin+2} * * * *`,
//   weeklyReport:   `${startMin+3} * * * *`,
//   getWeeklyRank:  `${startMin+4} * * * *`,
//   monthlyReport:  `${startMin+5} * * * *`,
//   getMonthlyRank: `${startMin+6} * * * *`
// }
const cronSchedule = {
  getUpdate: '10 * * * *',      // every hour at minute 10
  dailyReport: '13 0 * * *',    // every day at 0:13
  getDailyRank: '15 0 * * *',   // every day at 0:15
  weeklyReport: '17 0 * * 1',   // every monday at 0:17
  getWeeklyRank: '19 0 * * 1',  // every monday at 0:19
  // for now we just run this weekly to debug
  monthlyReport: '21 0 * * 1',  // every monday at 0:21
  getMonthlyRank: '23 0 * * 1'  // every monday at 0:23
}
const config = { cronSchedule }
module.exports = { config }