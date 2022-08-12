const Notification = require('./models/Notification.js')
const Stat = require('./models/Stat.js')
const { Config } = require('./Config.js')
const config = new Config()
/**
 * Count likes and messages activity today, and mark them so won't be counted twice
 * @returns {Boolean} - True if success, otherwise error
 */
const reportDaily = async () => {
  console.log('[-] Running daily report...')
  config.set('lastRunDailyReport', Date.now())
  const unreadNotifications = await Notification.find({isRead: false, type: 'ACTIVITY_LIKE'})
  if(unreadNotifications.length === 0) {
    console.log('    No new notifications')
    return true
  }
  console.log(`    Got ${unreadNotifications.length} new notifications`)

  const queryUnreadCountUpdate = unreadNotifications.map(item => {
    return {
      updateOne:{
        "filter": {_id: item._id},
        "update": {
          isRead: true
        }
      }
    }
  })

  const notifications = await Notification.aggregate([
    {$match: {isRead: false, type: 'ACTIVITY_LIKE'}},
    {$group: {
        _id: "$userId",
        likeReceivedToday: {
          $count: {}
        }
    }},
    {$project: {
      _id: 0,
      likeReceivedToday: "$likeReceivedToday",
      userId: "$_id"
    }}
  ])
  console.log(`    Got ${notifications.length} unique notifications`)
  
  const queryStatLikeTodayUpdate = notifications.map(item => {
    return {
      updateOne: {
        "filter": {userId: item.userId},
        "update": {
          $inc: {likeReceivedToday: item.likeReceivedToday},
          $set: {lastReceivedLike: Date.now()}
        },
        "upsert": true
      }
    }
  })


  console.log(`[+] Updating ${queryStatLikeTodayUpdate.length} users' stat`)
  const execQueryStatLikeTodayUpdate = await Stat.bulkWrite(queryStatLikeTodayUpdate)
  if(execQueryStatLikeTodayUpdate.ok) {
    console.log(`    Updated ${execQueryStatLikeTodayUpdate.nModified}, Upserted ${execQueryStatLikeTodayUpdate.nUpserted}`)
  } else {
    console.log('    Error updating stats')
    return false
  }
  
  console.log(`[+] Updating ${queryUnreadCountUpdate.length} notifications`)
  const execQueryUnreadCountUpdate = await Notification.bulkWrite(queryUnreadCountUpdate)
  if(execQueryUnreadCountUpdate.ok) {
    console.log(`    Updated ${execQueryUnreadCountUpdate.nModified}, Upserted ${execQueryUnreadCountUpdate.nUpserted}`)
  } else {
    console.log('    Error updating notifications')
    return false
  }

  return true
}

/**
 * Count all like stats from this week, and delete like notification
 * @returns {Boolean} - True if success, otherwise error
 */
const reportWeekly = async () => {
  console.log('[-] Running weekly report...')
  config.set('lastRunWeeklyReport', Date.now())
  const stats = await Stat.find({likeReceivedToday: {$gt: 0}})
  if(stats.length === 0) {
    console.log('    Nothing to update')
    return false
  }
  const queryWeeklyLikeUpdate = stats.map(item => {
    return {
      updateOne: {
        "filter": {_id: item._id},
        "update": {
          $inc: {likeReceivedWeek: item.likeReceivedToday},
          $set: {likeReceivedToday: 0}
        }
      }
    }
  })
  console.log(`[+] Updating ${queryWeeklyLikeUpdate.length} stats`)
  const execQueryWeeklyLikeUpdate = await Stat.bulkWrite(queryWeeklyLikeUpdate)
  if(execQueryWeeklyLikeUpdate.ok) {
    console.log(`    Updated ${execQueryWeeklyLikeUpdate.nModified}, Upserted ${execQueryWeeklyLikeUpdate.nUpserted}`)
  } else {
    console.log('    Error updating stats')
    return false
  }
  console.log('[-] Deleting like notifications...')
  const readLikeNotifications = await Notification.deleteMany({isRead: true, type: 'ACTIVITY_LIKE'})
  console.log(`    Deleted ${readLikeNotifications.deletedCount} like notifications`)
  return true
}

/**
 * Count all like stats from this month, and delete all notification
 * @returns {Boolean} - True if success, otherwise error
 */
const reportMonthly = async () => {
  console.log('[-] Running monthly report...')
  config.set('lastRunMonthlyReport', Date.now())
  const stats = await Stat.find({likeReceivedWeek: {$gt: 0}})
  if(stats.length === 0) {
    console.log('    Nothing to update')
    return false
  }
  const queryWeeklyLikeUpdate = stats.map(item => {
    return {
      updateOne: {
        "filter": {userId: item.userId},
        "update": {
          $inc: {likeReceivedMonth: item.likeReceivedWeek},
          $set: {likeReceivedWeek: 0}
        }
      }
    }
  })
  console.log(`[+] Updating ${queryWeeklyLikeUpdate.length} stats`)
  const execqueryWeeklyLikeUpdate = await Stat.bulkWrite(queryWeeklyLikeUpdate)
  if(execqueryWeeklyLikeUpdate.ok) {
    console.log(`    Updated ${execqueryWeeklyLikeUpdate.nModified}, Upserted ${execqueryWeeklyLikeUpdate.nUpserted}`)
  } else {
    console.log('    Error updating stats')
    return false
  }   

  
  console.log('[-] Deleting notifications...')
  const readNotifications = await Notification.deleteMany({isRead: true})
  console.log(`    Deleted ${readNotifications.deletedCount} notifications`)
  return true
}

module.exports = { reportDaily, reportWeekly, reportMonthly }