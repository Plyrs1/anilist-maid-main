const cron = require('node-cron');
const { cronParse } = require('./utils.js');

const { reportDaily, reportWeekly, reportMonthly } = require('./Report.js')
const { getDailyRank, getWeeklyRank, getMonthlyRank } = require('./BannerGen.js')

// const cronSchedule = {
//   getUpdate: '13 * * * *',
//   dailyReport: '0 0 * * *',
//   weeklyReport: '0 1 * * 1',
//   monthlyReport: '0 2 1 * *'
// }
const startMin = 30
const cronSchedule = {
  getUpdate:      `${startMin} * * * *`,
  dailyReport:    `${startMin+1} * * * *`,
  getDailyRank:   `${startMin+2} * * * *`,
  weeklyReport:   `${startMin+3} * * * *`,
  getWeeklyRank:  `${startMin+4} * * * *`,
  monthlyReport:  `${startMin+5} * * * *`,
  getMonthlyRank: `${startMin+6} * * * *`
}

const nextRun = () => {
  return Object.keys(cronSchedule).reduce((obj, i) => {obj[i] = cronParse(cronSchedule[i]); return obj},{})
}
const runCron = (anilist) => {
  cron.schedule(cronSchedule.getUpdate, async () => {
    console.log('[+] Running notification fetcher...');
    try {
      const hasUnreadNotifications = await anilist.hasUnreadNotifications()
      if (hasUnreadNotifications) {
        console.log(`[+] You have ${anilist.unreadNotificationCount} unread notifications.`)
        console.log('    Getting notifications...')
        const notifs = await anilist.getNotifications(anilist.unreadNotificationCount)
        console.log(notifs)
        console.log('    Done')
        const a = await anilist.saveNotifications(notifs)
        if (a) console.log('[+] Saving success')
        else console.log('[x] Saving error')
      } else {
        console.log('[ ] You have no unread notification.')
      }
    } catch (e) {
      console.error(e)
    }
  });

  cron.schedule(cronSchedule.dailyReport, async () => {
    await reportDaily()
  })
  cron.schedule(cronSchedule.getDailyRank, async () => {
    await getDailyRank()
  })
  cron.schedule(cronSchedule.weeklyReport, async () => {
    await reportWeekly()
  })
  cron.schedule(cronSchedule.getWeeklyRank, async () => {
    await getWeeklyRank()
  })
  cron.schedule(cronSchedule.monthlyReport, async () => {
    await reportMonthly()
  })
  cron.schedule(cronSchedule.getMonthlyRank, async () => {
    await getMonthlyRank()
  })
}

module.exports = { runCron, nextRun }