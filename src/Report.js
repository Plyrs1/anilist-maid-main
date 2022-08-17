const Notification = require('./models/Notification.js')
const Stat = require('./models/Stat.js')
const { setConfig } = require('./Config.js')

/**
 * Count likes and messages activity today, and mark them so won't be counted twice
 * Also adds them into daily, weekly, and monthly like count.
 * @returns {Boolean} - True if success, false otherwise
 */
const reportLikeCount = async () => {
  console.log('[-] Running reportLikeCount...')
  setConfig('lastRunReportLikeCount', Date.now())
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
          $inc: {likeReceivedToday: item.likeReceivedToday, likeReceivedWeek: item.likeReceivedToday, likeReceivedMonth: item.likeReceivedToday},
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
 * Reset daily like
 * @returns {Boolean} - True if success, false otherwise
 */
 const reportClearDaily = async () => {
  console.log('[-] Running reportClearDaily...')
  setConfig('lastRunReportClearDaily', Date.now())
  const stats = await Stat.find({likeReceivedToday: {$gt: 0}})
  if(stats.length === 0) {
    console.log('    Nothing to update')
    return false
  }
  const queryDailyLikeUpdate = stats.map(item => {
    return {
      updateOne: {
        "filter": {_id: item._id},
        "update": {
          $set: {likeReceivedToday: 0}
        }
      }
    }
  })
  console.log(`[+] Updating ${queryDailyLikeUpdate.length} stats`)
  const execQueryDailyLikeUpdate = await Stat.bulkWrite(queryDailyLikeUpdate)
  if(execQueryDailyLikeUpdate.ok) {
    console.log(`    Updated ${execQueryDailyLikeUpdate.nModified}, Upserted ${execQueryDailyLikeUpdate.nUpserted}`)
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
 * Reset weekly like
 * @returns {Boolean} - True if success, false otherwise
 */
 const reportClearWeekly = async () => {
  console.log('[-] Running reportClearWeekly...')
  setConfig('lastRunReportClearWeekly', Date.now())
  const stats = await Stat.find({likeReceivedWeek: {$gt: 0}})
  if(stats.length === 0) {
    console.log('    Nothing to update')
    return false
  }
  const queryWeeklyLikeUpdate = stats.map(item => {
    return {
      updateOne: {
        "filter": {_id: item._id},
        "update": {
          $set: {likeReceivedWeek: 0}
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
  return true
}

/**
 * Reset monthly like
 * @returns {Boolean} - True if success, false otherwise
 */
 const reportClearMonthly = async () => {
  console.log('[-] Running reportClearMonthly...')
  setConfig('lastRunReportClearMonthly', Date.now())
  const stats = await Stat.find({likeReceivedMonth: {$gt: 0}})
  if(stats.length === 0) {
    console.log('    Nothing to update')
    return false
  }
  const queryMonthlyLikeUpdate = stats.map(item => {
    return {
      updateOne: {
        "filter": {_id: item._id},
        "update": {
          $set: {likeReceivedMonth: 0}
        }
      }
    }
  })
  console.log(`[+] Updating ${queryMonthlyLikeUpdate.length} stats`)
  const execQueryMonthlyLikeUpdate = await Stat.bulkWrite(queryMonthlyLikeUpdate)
  if(execQueryMonthlyLikeUpdate.ok) {
    console.log(`    Updated ${execQueryMonthlyLikeUpdate.nModified}, Upserted ${execQueryMonthlyLikeUpdate.nUpserted}`)
  } else {
    console.log('    Error updating stats')
    return false
  }
  return true
}



module.exports = { reportLikeCount, reportClearDaily, reportClearWeekly, reportClearMonthly }
