const cron = require('node-cron');
const { config } = require('../config.js')
const { reportDaily, reportWeekly, reportMonthly } = require('./Report.js')
const { getDailyRank, getWeeklyRank, getMonthlyRank } = require('./BannerGen.js')

const runCron = (anilist) => {
  cron.schedule(config.cronSchedule.getUpdate, async () => {
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

  cron.schedule(config.cronSchedule.dailyReport, async () => {
    await reportDaily()
  })
  cron.schedule(config.cronSchedule.getDailyRank, async () => {
    await getDailyRank()
  })
  cron.schedule(config.cronSchedule.weeklyReport, async () => {
    await reportWeekly()
  })
  cron.schedule(config.cronSchedule.getWeeklyRank, async () => {
    await getWeeklyRank()
  })
  cron.schedule(config.cronSchedule.monthlyReport, async () => {
    await reportMonthly()
  })
  cron.schedule(config.cronSchedule.getMonthlyRank, async () => {
    await getMonthlyRank()
  })
}

module.exports = { runCron }
