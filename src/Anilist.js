const fetch = require('node-fetch')
const { RateLimiter } = require('limiter')
const User = require('./models/User.js')
const Notification = require('./models/Notification.js')
const hasUnreadNotificationQuery = require('./query/hasUnreadNotification.js')
const getNotificationsQuery = require('./query/getNotifications.js')

/** Anilist main class */
class Anilist {
  constructor(token){
    this.token = token
    this.limiter = new RateLimiter({
      tokensPerInterval: 80,
      interval: "minute",
      fireImmediately: true
    });
    this.unreadNotificationCount = 0
    this.user = {}
    this.resetNotificationCount = true
  }
  /**
   * Run GraphQL query
   * @param {String} q GraphQL query string
   * @param {Object} variables GraphQL variables
   * @returns {(Object|null)}
   */
  async query(q="",variables={}){
    console.time("graphql-ratelimit")
    const remainingRequests = await this.limiter.removeTokens(1);
    console.timeEnd("graphql-ratelimit")
    if (remainingRequests <= 0) {
      console.error('[x] Rate limited.')
      // return null
    }
    const a = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body : JSON.stringify({
        query: q,
        variables 
      })
    })
    if(a.status !== 200){
      console.log(`Error ${a.status}: ${a.statusText}`)
      return null
    }
    const b = await a.json()
    return b.data
  }

  /**
   * Get unread notifications count
   * @return {boolean}
   */
  async hasUnreadNotifications(){
    try {
      const user = await this.query(hasUnreadNotificationQuery)
      this.unreadNotificationCount = user.Viewer.unreadNotificationCount
      this.user.name = user.Viewer.name
      this.user.id = user.Viewer.id
      this.user.avatar = user.Viewer.avatar.medium
      if(this.unreadNotificationCount > 0){
        return true
      }
    } catch (error) {
      console.error(error)
      this.unreadNotificationCount = 0
    }
    return false
  }

  /**
   * Fetch notifications from api
   * @param {number} count fetch notification this much from the api
   * @param {number} page get page, only used in recursive call
   * @returns {Array}
   */
  async getNotifications(count = 50, page = 1){
    const tmp = []
    const q = await this.query(getNotificationsQuery, {
      page,
      resetNotificationCount: this.resetNotificationCount
    })
    const data = q.Page
    console.log(`page ${data.pageInfo.currentPage} * ${count} = ${count * data.pageInfo.currentPage}`)
    if(data.pageInfo.hasNextPage && count > 50){
      const countRemainder = count - 50
      tmp.push(...data.notifications)
      const q1 = await this.getNotifications(countRemainder, page + 1)
      tmp.push(...q1)
    } else {
      tmp.push(...data.notifications.slice(0,count))
    }
    return tmp
  }

  /**
   * Save notifications to database
   * @param {Array} notifs 
   * @returns {boolean}
   */
  async saveNotifications(notifs) {
    try {
        const users = []
        // hold user id so there won't be any duplicate
        const userId = []
        const a = notifs.map(value => {
            // console.log(`User ${value.user.name} (${value.user.id}) : ${value.type}`)
            if(value.type === 'FOLLOWING') value.activityId = value.id
            value.userId = value.user.id
            if(!!userId.find(i => i === value.user.id) === false){
                userId.push(value.user.id)
                users.push({
                    updateOne: {
                        filter: {id: value.user.id},
                        update: {
                            id: value.user.id,
                            name: value.user.name,
                            avatar: value.user.avatar.medium || null,
                            // set to true so we know this user recently
                            // liked us but not responded yet
                            hasInteracted: true,
                        },
                        upsert: true
                    }
                    
                })
            }
            return value
        })
        console.log(`[+] Saving ${userId.length} users`)
        const tmp1 = await User.bulkWrite(users)
        if(tmp1.ok) console.log(`    Updated ${tmp1.nModified}, Upserted ${tmp1.nUpserted}`)
        
        console.log(`[+] Saving ${a.length} notifications`)
        const tmp2 = await Notification.insertMany(a)
        if(tmp2.length === a.length) console.log('    Notif saving success')
        if(tmp1.ok && tmp2.length === a.length) return true
        console.log(tmp2)
    } catch (error) {
        console.log(error)
    }
    return false
  }

}

module.exports = { Anilist }


// Notification = require('./src/models/Notification.js'); Stat = require('./src/models/Stat.js')