const cron = require('node-cron');
const { cronParse } = require('./utils.js');

const { reportDaily, reportWeekly, reportMonthly } = require('./Report.js')

// const cronSchedule = {
//   getUpdate: '13 * * * *',
//   dailyReport: '0 0 * * *',
//   weeklyReport: '0 1 * * 1',
//   monthlyReport: '0 2 1 * *'
// }

const cronSchedule = {
  getUpdate: '15 * * * *',
  dailyReport: '16 * * * *',
  weeklyReport: '22 * * * *',
  monthlyReport: '23 * * * *'
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
  cron.schedule(cronSchedule.weeklyReport, async () => {
    await reportWeekly()
  })
  cron.schedule(cronSchedule.monthlyReport, async () => {
    await reportMonthly()
  })
}

module.exports = { runCron, nextRun }